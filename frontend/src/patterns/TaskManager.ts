import { Task } from "@/types/Task"
import { TaskAdapter } from "./TaskAdapter"

type TaskListener = (tasks: Task[]) => void

class TaskManagerClass {
  private static instance: TaskManagerClass
  private tasks: Task[] = []
  private listeners: TaskListener[] = []
  private isInitialized = false

  private constructor() {
    this.tasks = []
  }

  public static getInstance(): TaskManagerClass {
    if (!TaskManagerClass.instance) {
      TaskManagerClass.instance = new TaskManagerClass()
    }
    return TaskManagerClass.instance
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const fetchedTasks = await TaskAdapter.fetchTasks()
      this.tasks = fetchedTasks
      this.isInitialized = true
      this.notifyListeners()
    } catch (error) {
      console.error("Failed to initialize TaskManager:", error)
    }
  }

  public async addTask(task: Task): Promise<void> {
    try {
      const createdTask = await TaskAdapter.createTask(task)
      if (createdTask) {
        this.tasks = [...this.tasks, createdTask]
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  public async removeTask(taskId: string): Promise<void> {
    try {
      const success = await TaskAdapter.deleteTask(taskId)
      if (success) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error removing task:", error)
    }
  }

  public async updateTask(updatedTask: Task): Promise<void> {
    try {
      const result = await TaskAdapter.updateTask(updatedTask)
      if (result) {
        this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? result : task))
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  public async toggleTaskCompletion(taskId: string): Promise<void> {
    try {
      const updatedTask = await TaskAdapter.toggleTaskCompletion(taskId)
      if (updatedTask) {
        this.tasks = this.tasks.map((task) => (task.id === taskId ? updatedTask : task))
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error toggling task completion:", error)
    }
  }

  public async toggleSubtaskCompletion(taskId: string, subtaskId: string): Promise<void> {
    try {
      const updatedTask = await TaskAdapter.toggleSubtaskCompletion(taskId, subtaskId)
      if (updatedTask) {
        this.tasks = this.tasks.map((task) => (task.id === taskId ? updatedTask : task))
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error toggling subtask completion:", error)
    }
  }

  public searchTasks(query: string): Task[] {
    return this.tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()))
  }

  public getTasks(): Task[] {
    return [...this.tasks]
  }

  public subscribe(listener: TaskListener): () => void {
    this.listeners.push(listener)

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.tasks]))
  }
}

export const TaskManager = TaskManagerClass.getInstance()

export default TaskManager
