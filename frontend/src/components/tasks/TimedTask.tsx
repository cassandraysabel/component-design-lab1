
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, Clock } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { TaskDecorator } from "../TaskDecorator"
import { Notification } from "../Notification"
import { Task } from "@/types/Task"

interface TimedTaskProps {
  task: Task
  onDelete: () => void
  onComplete: () => void
  onUpdate: (task: Task) => void
}

export function TimedTask({ task, onDelete, onComplete, onUpdate }: TimedTaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "")

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({
        ...task,
        title: editedTitle,
        dueDate: editedDueDate || undefined,
      })
      setIsEditing(false)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No due date"

  return (
    <Card className="relative">
      {/* Decorator Pattern: Add reminder icon if task has due date */}
      <TaskDecorator task={task} />

      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={onComplete} className="mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                  className="mb-2"
                />
                <Input
                  type="datetime-local"
                  value={editedDueDate ? new Date(editedDueDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setEditedDueDate(e.target.value ? new Date(e.target.value).toISOString() : "")}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-lg font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Due: {formattedDueDate}</span>
                </div>
              </div>
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
