import { toast } from "sonner"
import { apiErrorMessage } from "./formErrors"

const fallbackMessage = "Something went wrong."

function show(kind: "success" | "error" | "info" | "warning", message: string) {
  const text = message.trim()
  if (!text) return
  toast[kind](text)
}

export const raToast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
  info: (message: string) => show("info", message),
  warning: (message: string) => show("warning", message),
  fromError: (error: unknown, fallback = fallbackMessage) =>
    show("error", apiErrorMessage(error, fallback)),
}
