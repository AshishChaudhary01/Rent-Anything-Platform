import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import RaButton from "../button/RaButton"
import { useLoginGateStore } from "../../store/loginGateStore"

function RaLoginGate() {
  const open = useLoginGateStore((s) => s.open)
  const message = useLoginGateStore((s) => s.message)
  const next = useLoginGateStore((s) => s.next)
  const closeGate = useLoginGateStore((s) => s.closeGate)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGate()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeGate])

  if (!open) return null

  const state = { from: next }

  return createPortal(
    <div className="fixed inset-0 z-[280] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={closeGate}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rap-login-gate-title"
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-5 flex flex-col gap-4"
      >
        <div>
          <h2 id="rap-login-gate-title" className="text-lg font-bold">Sign in to continue</h2>
          <p className="text-sm text-muted mt-1">{message}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/auth/login" state={state} onClick={closeGate}>
            <RaButton type="button" btnText="Log in" />
          </Link>
          <Link to="/auth/register" state={state} onClick={closeGate}>
            <RaButton type="button" btnText="Create an account" variant="outline" />
          </Link>
          <RaButton type="button" btnText="Not now" variant="ghost" clickFunc={closeGate} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default RaLoginGate
