import { toast } from "sonner"
import { apiErrorMessage } from "./formErrors"

const fallbackMessage = "Something went wrong."

export const raToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  fromError: (error: unknown, fallback = fallbackMessage) =>
    toast.error(apiErrorMessage(error, fallback)),
}
