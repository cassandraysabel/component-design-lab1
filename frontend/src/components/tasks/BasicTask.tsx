
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { TaskDecorator } from "../TaskDecorator"
import { Notification } from "../Notification"
import { Task } from "@/types/Task"


interface BasicTaskProps {
  task: Task
  onDelete: () => void
  onComplete: () => void
  onUpdate: (task: Task) => void
}

export function BasicTask({ task, onDelete, onComplete, onUpdate }: BasicTaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({ ...task, title: editedTitle })
      setIsEditing(false)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <Card className="relative">
      {/* Decorator Pattern: Add reminder icon if task has due date */}
      <TaskDecorator task={task} />

      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={onComplete} className="mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="mb-2"
              />
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                className={`text-lg font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </label>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm text-muted-foreground">Created: {new Date(task.createdAt).toLocaleDateString()}</div>
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
