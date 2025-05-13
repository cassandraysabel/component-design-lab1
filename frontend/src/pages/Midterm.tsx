import { useState, useEffect } from "react"
import { TaskFactory } from "@/components/TaskFactory"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PlusCircle, X } from "lucide-react"
import { Task } from "@/types/Task"
import { TaskManager } from "@/patterns/TaskManager"
import { TaskSortingStrategy } from "@/patterns/TaskSortingStrategy"

const Midterm = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskType, setNewTaskType] = useState<"basic" | "timed" | "checklist">("basic")
  const [sortStrategy, setSortStrategy] = useState<"date" | "name" | "id">("date")
  const [loading, setLoading] = useState(true)
  const [dueDate, setDueDate] = useState("")
  const [subtasks, setSubtasks] = useState([{ id: "1", text: "", completed: false }])

  useEffect(() => {
    const initializeTaskManager = async () => {
      setLoading(true)
      try {
        await TaskManager.initialize()
        setTasks(TaskManager.getTasks())
      } catch (error) {
        console.error("Error initializing tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeTaskManager()

    const unsubscribe = TaskManager.subscribe((updatedTasks) => {
      setTasks(updatedTasks)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        type: newTaskType,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: newTaskType === "timed" && dueDate ? new Date(dueDate).toISOString() : undefined,
        items: newTaskType === "checklist" ? 
          subtasks.filter(item => item.text.trim()).map(item => ({
            id: item.id,
            text: item.text,
            completed: false
          })) : 
          undefined,
      }
      if (
        newTaskType === "basic" ||
        (newTaskType === "timed" && dueDate) ||
        (newTaskType === "checklist" && subtasks.some((item) => item.text.trim()))
      ) {
        await TaskManager.addTask(newTask)
        setNewTaskTitle("")
        setDueDate("")
        setSubtasks([{ id: "1", text: "", completed: false }])
      } else if (newTaskType === "timed" && !dueDate) {
        alert("Please set a due date for the timed task")
      } else if (newTaskType === "checklist" && !subtasks.some((item) => item.text.trim())) {
        alert("Please add at least one subtask with text")
      }
    }
  }

  const sortedTasks = (() => {
    switch (sortStrategy) {
      case "date":
        return TaskSortingStrategy.sortByDate(tasks)
      case "name":
        return TaskSortingStrategy.sortByName(tasks)
      case "id":
        return TaskSortingStrategy.sortById(tasks)
      default:
        return tasks
    }
  })()

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">To-Do List Application</h1>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-grow"
            />
            <Select
              value={newTaskType}
              onValueChange={(value) => {
                setNewTaskType(value as "basic" | "timed" | "checklist")
                if (value !== "checklist") {
                  setSubtasks([{ id: "1", text: "", completed: false }])
                }
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Task Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Task</SelectItem>
                <SelectItem value="timed">Timed Task</SelectItem>
                <SelectItem value="checklist">Checklist Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newTaskType === "timed" && (
            <div className="mt-2">
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date and Time
              </label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {newTaskType === "checklist" && (
            <div className="mt-2 space-y-2">
              <label className="block text-sm font-medium mb-1">Subtasks</label>
              {subtasks.map((subtask, index) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Subtask ${index + 1}`}
                    value={subtask.text}
                    onChange={(e) => {
                      const updatedSubtasks = [...subtasks]
                      updatedSubtasks[index].text = e.target.value
                      setSubtasks(updatedSubtasks)
                    }}
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSubtasks(subtasks.filter((item) => item.id !== subtask.id))
                    }}
                    disabled={subtasks.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSubtasks([...subtasks, { id: Date.now().toString(), text: "", completed: false }])
                }}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Subtask
              </Button>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={handleAddTask} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortStrategy} onValueChange={(value) => setSortStrategy(value as "date" | "name" | "id")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Due Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="id">Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tasks yet. Add your first task above!</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedTasks.map((task) => (
            <TaskFactory
              key={task.id}
              task={task}
              onDelete={() => TaskManager.removeTask(task.id)}
              onComplete={() => TaskManager.toggleTaskCompletion(task.id)}
              onUpdate={(updatedTask) => TaskManager.updateTask(updatedTask)}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default Midterm
