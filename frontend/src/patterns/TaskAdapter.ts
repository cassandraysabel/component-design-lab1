import { Task } from "@/types/Task"

export class TaskAdapter {
  private static API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  static async fetchTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.API_URL}/api/tasks`)

      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`)
      }

      const data = await response.json()

      return data.map(this.convertToInternalTask)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  }

  static async createTask(task: Task): Promise<Task | null> {
    try {
      const apiTask = {
        title: task.title,
        type: task.type,
        completed: task.completed,
        due_date: task.dueDate,
        items: task.items,
      }

      const response = await fetch(`${this.API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiTask),
      })

      if (!response.ok) {
        throw new Error(`Error creating task: ${response.statusText}`)
      }

      const data = await response.json()

      return this.convertToInternalTask(data)
    } catch (error) {
      console.error("Error creating task:", error)
      return null
    }
  }

  static async updateTask(task: Task): Promise<Task | null> {
    try {
      const apiTask = {
        title: task.title,
        type: task.type,
        completed: task.completed,
        due_date: task.dueDate,
        items: task.items,
      }

      const response = await fetch(`${this.API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiTask),
      })

      if (!response.ok) {
        throw new Error(`Error updating task: ${response.statusText}`)
      }

      const data = await response.json()

      return this.convertToInternalTask(data)
    } catch (error) {
      console.error(`Error updating task with ID ${task.id}:`, error)
      return null
    }
  }

  static async deleteTask(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error deleting task: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error)
      return false
    }
  }

  static async toggleTaskCompletion(id: string): Promise<Task | null> {
    try {
      const response = await fetch(`${this.API_URL}/api/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error toggling task completion: ${response.statusText}`)
      }

      const data = await response.json()

      return this.convertToInternalTask(data)
    } catch (error) {
      console.error(`Error toggling completion for task with ID ${id}:`, error)
      return null
    }
  }

  static async toggleSubtaskCompletion(taskId: string, subtaskId: string): Promise<Task | null> {
    try {
      const response = await fetch(`${this.API_URL}/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error toggling subtask completion: ${response.statusText}`)
      }

      const data = await response.json()

      return this.convertToInternalTask(data)
    } catch (error) {
      console.error(`Error toggling completion for subtask ${subtaskId} in task ${taskId}:`, error)
      return null
    }
  }

  private static convertToInternalTask(apiTask: any): Task {
    return {
      id: apiTask.id,
      title: apiTask.title,
      type: apiTask.type,
      completed: apiTask.completed,
      createdAt: apiTask.created_at,
      dueDate: apiTask.due_date,
      items: apiTask.items?.map((item: any) => ({
        id: item.id,
        text: item.text,
        completed: item.completed,
      })),
    }
  }
}

export default TaskAdapter
