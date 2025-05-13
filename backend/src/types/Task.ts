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
  created_at: string
  due_date?: string
  items?: ChecklistItem[]
}
