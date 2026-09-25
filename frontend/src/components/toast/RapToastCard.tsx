import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5"

const styles = {
  success: {
    wrap: "border-success/20 bg-soft-success text-success",
    icon: IoCheckmarkCircleOutline,
  },
  error: {
    wrap: "border-danger/20 bg-soft-danger text-danger",
    icon: IoWarningOutline,
  },
  warning: {
    wrap: "border-warning/25 bg-soft-warning text-warning",
    icon: IoWarningOutline,
  },
  info: {
    wrap: "border-primary/20 bg-accent text-primary",
    icon: IoInformationCircleOutline,
  },
}

function RapToastCard({
  kind,
  message,
  actionLabel,
  onAction,
  onClose,
}: {
  kind: keyof typeof styles
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
}) {
  const style = styles[kind]
  const Icon = style.icon
  return (
    <div className={`rap-toast flex items-start gap-3 min-w-[18rem] max-w-[22rem] rounded-2xl border px-3.5 py-3 shadow-lg ${style.wrap}`}>
      <Icon className="size-5 shrink-0 mt-0.5" />
      <p className="text-sm font-semibold flex-1 leading-snug">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="text-sm font-bold underline underline-offset-2 cursor-pointer shrink-0" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      {onClose ? (
        <button type="button" aria-label="Close" className="cursor-pointer shrink-0 opacity-70 hover:opacity-100" onClick={onClose}>
          <IoCloseOutline className="size-5" />
        </button>
      ) : null}
    </div>
  )
}

export default RapToastCard
