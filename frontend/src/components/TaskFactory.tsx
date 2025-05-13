import { BasicTask } from "./tasks/BasicTask"
import { Task } from "@/types/Task"
import { TimedTask } from "./tasks/TimedTask"
import { ChecklistTask } from "./tasks/ChecklistTask"

interface TaskFactoryProps {
  task: Task
  onDelete: () => void
  onComplete: () => void
  onUpdate: (task: Task) => void
}

export function TaskFactory({ task, onDelete, onComplete, onUpdate }: TaskFactoryProps) {
  switch (task.type) {
    case "basic":
      return <BasicTask task={task} onDelete={onDelete} onComplete={onComplete} onUpdate={onUpdate} />
    case "timed":
      return <TimedTask task={task} onDelete={onDelete} onComplete={onComplete} onUpdate={onUpdate} />
    case "checklist":
      return <ChecklistTask task={task} onDelete={onDelete} onComplete={onComplete} onUpdate={onUpdate} />
    default:
      return <BasicTask task={task} onDelete={onDelete} onComplete={onComplete} onUpdate={onUpdate} />
  }
}
