import { toast } from "sonner"
import { createElement } from "react"
import { apiErrorMessage } from "./formErrors"
import RapToastCard from "../components/toast/RapToastCard"

const fallbackMessage = "Something went wrong."

function push(kind: "success" | "error" | "info" | "warning", message: string, duration = 3500) {
  const text = message.trim()
  if (!text) return
  toast.custom(
    (id) =>
      createElement(RapToastCard, {
        kind,
        message: text,
        onClose: () => toast.dismiss(id),
      }),
    { duration },
  )
}

export const raToast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message, 5000),
  info: (message: string) => push("info", message),
  warning: (message: string) => push("warning", message, 4500),
  fromError: (error: unknown, fallback = fallbackMessage) =>
    push("error", apiErrorMessage(error, fallback), 5000),
  undo: (message: string, onUndo: () => void | Promise<void>) => {
    const text = message.trim()
    if (!text) return
    toast.custom(
      (id) =>
        createElement(RapToastCard, {
          kind: "info",
          message: text,
          actionLabel: "Undo",
          onAction: () => {
            toast.dismiss(id)
            void Promise.resolve(onUndo()).catch((error) => raToast.fromError(error, "Could not undo"))
          },
          onClose: () => toast.dismiss(id),
        }),
      { duration: 8000 },
    )
  },
}
