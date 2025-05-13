import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface NotificationProps {
  message: string
}

export function Notification({ message }: NotificationProps) {
  return (
    <Alert variant="destructive" className="absolute bottom-0 left-0 right-0 rounded-t-none">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
