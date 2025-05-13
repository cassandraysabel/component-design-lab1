export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  type: "basic" | "timed" | "checklist"
  completed: boolean
  createdAt: string
  dueDate?: string
  items?: ChecklistItem[]
}   