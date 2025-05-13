
import { Bell } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Task } from "@/types/Task"

interface TaskDecoratorProps {
  task: Task
}

export function TaskDecorator({ task }: TaskDecoratorProps) {
  if (!task.dueDate || task.completed) {
    return null
  }

  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date()
  const formattedDate = dueDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`absolute top-2 right-2 ${isOverdue ? "text-destructive" : "text-primary"}`}>
            <Bell className="h-5 w-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isOverdue ? "Overdue" : "Due"}: {formattedDate}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
