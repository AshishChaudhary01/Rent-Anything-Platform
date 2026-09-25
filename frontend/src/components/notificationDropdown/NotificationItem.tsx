import { Link } from "react-router-dom"
import {
  IoCalendarOutline,
  IoCardOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoCubeOutline,
  IoScanOutline,
  IoSparklesOutline,
} from "react-icons/io5"
import type { AppNotification, NotificationKind } from "../../services/notification.service"

const kindIcon: Record<NotificationKind, typeof IoCubeOutline> = {
  MESSAGE: IoChatbubbleOutline,
  BOOKING: IoCheckmarkCircleOutline,
  RENTAL: IoCubeOutline,
  PICKUP: IoCalendarOutline,
  REQUEST: IoCubeOutline,
  RETURN: IoScanOutline,
  PAYMENT: IoCardOutline,
  WELCOME: IoSparklesOutline,
}

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.max(0, Math.floor(ms / 60000))
  if (min < 1) return "Just now"
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}

function NotificationItem({
  item,
  onClick,
  onMarkRead,
  compact,
}: {
  item: AppNotification
  onClick?: () => void
  onMarkRead?: (id: string) => void
  compact?: boolean
}) {
  const Icon = kindIcon[item.kind] || IoCubeOutline
  const path = item.path || "/user/notifications"

  return (
    <div className={`flex items-start gap-2 ${item.read ? "" : "bg-accent/50"}`}>
      <Link
        to={path}
        onClick={onClick}
        className={`flex flex-1 min-w-0 gap-3 ${compact ? "p-3" : "p-4"}`}
      >
        <div className="relative shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className={`${compact ? "size-11" : "size-14"} rounded-xl object-cover bg-surface`}
            />
          ) : (
            <div className={`${compact ? "size-11" : "size-14"} rounded-xl bg-surface`} />
          )}
          <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary text-white flex items-center justify-center">
            <Icon className="size-3" />
          </span>
        </div>
        <div className="min-w-0">
          <div className={`${compact ? "text-sm font-semibold" : "font-semibold"}`}>{item.title}</div>
          <div className={`${compact ? "text-sm" : "font-medium"} text-muted`}>{item.body}</div>
          <div className="text-xs md:text-sm text-muted">{relativeTime(item.createdAt)}</div>
        </div>
      </Link>
      {!item.read && (
        <button
          type="button"
          title="Mark as read"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onMarkRead?.(item.id)
          }}
          className={`shrink-0 text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer ${compact ? "pr-3 pt-3" : "pr-4 pt-4"}`}
        >
          <IoCheckmarkOutline className="size-4" />
          {!compact && "Mark as read"}
        </button>
      )}
    </div>
  )
}

export default NotificationItem
