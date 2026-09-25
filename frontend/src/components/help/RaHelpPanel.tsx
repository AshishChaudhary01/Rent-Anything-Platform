import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { IoCloseOutline } from "react-icons/io5"
import RaButton from "../button/RaButton"
import { helpTopicById } from "../../lib/helpGuides"
import { useHelpStore } from "../../store/helpStore"

function RaHelpPanel() {
  const open = useHelpStore((s) => s.open)
  const topicId = useHelpStore((s) => s.topicId)
  const closeHelp = useHelpStore((s) => s.closeHelp)
  const topic = helpTopicById(topicId)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeHelp()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeHelp])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Dismiss help"
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={closeHelp}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rap-help-title"
        className="relative w-full max-w-md max-h-[85dvh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Guide</p>
            <h2 id="rap-help-title" className="text-lg font-bold">{topic.title}</h2>
            <p className="text-sm text-muted mt-1">{topic.summary}</p>
          </div>
          <button type="button" aria-label="Close" className="cursor-pointer text-muted hover:text-primary" onClick={closeHelp}>
            <IoCloseOutline className="size-6" />
          </button>
        </div>
        <ol className="flex flex-col gap-2 list-decimal pl-5 text-sm">
          {topic.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {topic.tips?.length ? (
          <div className="rounded-2xl bg-accent px-3 py-3 text-sm text-primary">
            {topic.tips.map((tip) => (
              <p key={tip}>{tip}</p>
            ))}
          </div>
        ) : null}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          {window.location.pathname.startsWith("/user") ? (
            <Link to="/user/help" onClick={closeHelp}>
              <RaButton type="button" btnText="All guides" variant="ghost" widthFill={false} />
            </Link>
          ) : null}
          <RaButton type="button" btnText="Got it" widthFill={false} clickFunc={closeHelp} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default RaHelpPanel
