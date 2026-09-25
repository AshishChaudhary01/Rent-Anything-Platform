import { useEffect } from "react"
import { createPortal } from "react-dom"
import RaButton from "../button/RaButton"
import { useConfirmStore } from "../../store/confirmStore"

function RaConfirmDialog() {
  const open = useConfirmStore((s) => s.open)
  const options = useConfirmStore((s) => s.options)
  const settle = useConfirmStore((s) => s.settle)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") settle(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, settle])

  if (!open || !options) return null

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={() => settle(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rap-confirm-title"
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-5 flex flex-col gap-4"
      >
        <div>
          <h2 id="rap-confirm-title" className="text-lg font-bold">{options.title}</h2>
          {options.body ? <p className="text-sm text-muted mt-1">{options.body}</p> : null}
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <RaButton
            type="button"
            btnText={options.cancelText || "Cancel"}
            variant="ghost"
            widthFill={false}
            clickFunc={() => settle(false)}
          />
          <RaButton
            type="button"
            btnText={options.confirmText || "Confirm"}
            variant={options.danger ? "danger" : "primary"}
            widthFill={false}
            clickFunc={() => settle(true)}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default RaConfirmDialog
