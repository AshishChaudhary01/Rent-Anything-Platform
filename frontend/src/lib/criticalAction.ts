import { askConfirm, type ConfirmOptions } from "../store/confirmStore"
import { apiErrorMessage } from "./formErrors"
import { raToast } from "./raToast"

export async function runConfirmedAction(options: {
  confirm: ConfirmOptions
  run: () => Promise<unknown>
  success: string
  undo?: () => Promise<unknown>
}) {
  const ok = await askConfirm(options.confirm)
  if (!ok) return false
  try {
    await options.run()
    if (options.undo) {
      raToast.undo(options.success, () =>
        Promise.resolve(options.undo?.()).catch((error) => {
          raToast.error(apiErrorMessage(error, "Could not undo"))
        }),
      )
    } else {
      raToast.success(options.success)
    }
    return true
  } catch (error) {
    raToast.error(apiErrorMessage(error))
    return false
  }
}

export { askConfirm }
export type { ConfirmOptions }
