import { toast } from "sonner"
import axios from "axios"

const fallbackMessage = "Something went wrong."

function errorMessage(error: unknown, fallback = fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.details ?? error.response?.data?.message
    if (typeof message === "string" && message.trim()) return message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export const raToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  fromError: (error: unknown, fallback = fallbackMessage) =>
    toast.error(errorMessage(error, fallback)),
}
