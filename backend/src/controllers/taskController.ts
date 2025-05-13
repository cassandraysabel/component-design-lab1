import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);
// Define types
interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Task {
  id: string
  title: string
  type: "basic" | "timed" | "checklist"
  completed: boolean
  created_at: string
  due_date?: string
  items?: ChecklistItem[]
}

export const taskController = {
  // Get all tasks
  getAllTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase.from("tasks").select("*")

      if (error) throw error

      // Process tasks to handle checklist items
      const processedTasks = await Promise.all(
        data.map(async (task) => {
          if (task.type === "checklist") {
            // Fetch checklist items for this task
            const { data: items, error: itemsError } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("task_id", task.id)

            if (itemsError) throw itemsError

            return {
              ...task,
              items: items,
            }
          }
          return task
        }),
      )

      res.status(200).json(processedTasks)
    } catch (error) {
      next(error)
    }
  },

  // Get task by ID
  getTaskById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Task not found" })
        }
        throw error
      }

      // If it's a checklist task, fetch the items
      if (data.type === "checklist") {
        const { data: items, error: itemsError } = await supabase.from("checklist_items").select("*").eq("task_id", id)

        if (itemsError) throw itemsError

        data.items = items
      }

      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },

  // Create a new task
  createTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, type, completed, due_date, items } = req.body

      // Validate required fields
      if (!title || !type) {
        return res.status(400).json({ error: "Title and type are required" })
      }

      // Validate task type
      if (!["basic", "timed", "checklist"].includes(type)) {
        return res.status(400).json({ error: "Invalid task type" })
      }

      // Create the task
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title,
            type,
            completed: completed || false,
            due_date: due_date || null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // If it's a checklist task, create the items
      if (type === "checklist" && items && items.length > 0) {
        const itemsToInsert = items.map((item: any) => ({
          task_id: data.id,
          text: item.text,
          completed: item.completed || false,
        }))

        const { data: itemsData, error: itemsError } = await supabase
          .from("checklist_items")
          .insert(itemsToInsert)
          .select()

        if (itemsError) throw itemsError

        data.items = itemsData
      }

      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  },

  // Update an existing task
  updateTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { title, type, completed, due_date, items } = req.body

      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase.from("tasks").select("*").eq("id", id).single()

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return res.status(404).json({ error: "Task not found" })
        }
        throw fetchError
      }

      // Update the task
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: title !== undefined ? title : existingTask.title,
          type: type !== undefined ? type : existingTask.type,
          completed: completed !== undefined ? completed : existingTask.completed,
          due_date: due_date !== undefined ? due_date : existingTask.due_date,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // If it's a checklist task and items are provided, update the items
      if ((type === "checklist" || existingTask.type === "checklist") && items) {
        // First, delete existing items
        const { error: deleteError } = await supabase.from("checklist_items").delete().eq("task_id", id)

        if (deleteError) throw deleteError

        // Then, insert new items
        if (items.length > 0) {
          const itemsToInsert = items.map((item: any) => ({
            task_id: id,
            text: item.text,
            completed: item.completed || false,
          }))

          const { data: itemsData, error: itemsError } = await supabase
            .from("checklist_items")
            .insert(itemsToInsert)
            .select()

          if (itemsError) throw itemsError

          data.items = itemsData
        }
      }

      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },

  // Delete a task
  deleteTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase.from("tasks").select("*").eq("id", id).single()

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return res.status(404).json({ error: "Task not found" })
        }
        throw fetchError
      }

      // If it's a checklist task, delete the items first
      if (existingTask.type === "checklist") {
        const { error: deleteItemsError } = await supabase.from("checklist_items").delete().eq("task_id", id)

        if (deleteItemsError) throw deleteItemsError
      }

      // Delete the task
      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) throw error

      res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
      next(error)
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase.from("tasks").select("*").eq("id", id).single()

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return res.status(404).json({ error: "Task not found" })
        }
        throw fetchError
      }

      // Toggle completion status
      const { data, error } = await supabase
        .from("tasks")
        .update({
          completed: !existingTask.completed,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // If it's a checklist task, fetch the items
      if (data.type === "checklist") {
        const { data: items, error: itemsError } = await supabase.from("checklist_items").select("*").eq("task_id", id)

        if (itemsError) throw itemsError

        data.items = items
      }

      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },

  // Toggle subtask completion
  toggleSubtaskCompletion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId, subtaskId } = req.params

      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single()

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return res.status(404).json({ error: "Task not found" })
        }
        throw fetchError
      }

      // Check if subtask exists
      const { data: existingSubtask, error: fetchSubtaskError } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("id", subtaskId)
        .eq("task_id", taskId)
        .single()

      if (fetchSubtaskError) {
        if (fetchSubtaskError.code === "PGRST116") {
          return res.status(404).json({ error: "Subtask not found" })
        }
        throw fetchSubtaskError
      }

      // Toggle subtask completion
      const { error } = await supabase
        .from("checklist_items")
        .update({
          completed: !existingSubtask.completed,
        })
        .eq("id", subtaskId)

      if (error) throw error

      // Fetch the updated task with all its items
      const { data: updatedTask, error: taskError } = await supabase.from("tasks").select("*").eq("id", taskId).single()

      if (taskError) throw taskError

      // Fetch the updated items
      const { data: items, error: itemsError } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("task_id", taskId)

      if (itemsError) throw itemsError

      updatedTask.items = items

      res.status(200).json(updatedTask)
    } catch (error) {
      next(error)
    }
  },
}

export default taskController
