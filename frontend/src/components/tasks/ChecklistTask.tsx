
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { TaskDecorator } from "../TaskDecorator"
import { Notification } from "../Notification"
import { ChecklistItem, Task } from "@/types/Task"

interface ChecklistTaskProps {
  task: Task
  onDelete: () => void
  onComplete: () => void
  onUpdate: (task: Task) => void
}

export function ChecklistTask({ task, onDelete, onComplete, onUpdate }: ChecklistTaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedItems, setEditedItems] = useState<ChecklistItem[]>(task.items || [])
  const [newItemText, setNewItemText] = useState("")

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({
        ...task,
        title: editedTitle,
        items: editedItems,
      })
      setIsEditing(false)
    }
  }

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText,
        completed: false,
      }
      setEditedItems([...editedItems, newItem])
      setNewItemText("")
    }
  }

  const removeItem = (itemId: string) => {
    setEditedItems(editedItems.filter((item) => item.id !== itemId))
  }

  const toggleItemCompletion = (itemId: string) => {
    const updatedItems = editedItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )
    setEditedItems(updatedItems)

    // If not in editing mode, update the task
    if (!isEditing) {
      onUpdate({
        ...task,
        items: updatedItems,
      })
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  const completedItemsCount = (task.items || []).filter((item) => item.completed).length
  const totalItemsCount = (task.items || []).length
  const progress = totalItemsCount > 0 ? (completedItemsCount / totalItemsCount) * 100 : 0

  return (
    <Card className="relative">
      {/* Decorator Pattern: Add reminder icon if task has due date */}
      <TaskDecorator task={task} />

      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={onComplete} className="mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} autoFocus className="mb-2" />
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                className={`text-lg font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </label>
            )}

            <div className="mt-2">
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>

              {/* Checklist items */}
              <ul className="space-y-2 mt-3">
                {(isEditing ? editedItems : task.items || []).map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.text}
                    </label>
                    {isEditing && (
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>

              {/* Add new item form (only in edit mode) */}
              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Add new item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addItem}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm text-muted-foreground">
          {completedItemsCount} of {totalItemsCount} items completed
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardFooter>

      {/* Observer Pattern: Show notification for overdue tasks */}
      {isOverdue && <Notification message="This task is overdue!" />}
    </Card>
  )
}
