import { Link } from "react-router-dom"
import {
  IoCalendarOutline,
  IoCardOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoCubeOutline,
  IoScanOutline,
} from "react-icons/io5"
import type { AppNotification } from "../../data/notifications"

const kindIcon = {
  message: IoChatbubbleOutline,
  booking: IoCheckmarkCircleOutline,
  rental: IoCubeOutline,
  pickup: IoCalendarOutline,
  request: IoCubeOutline,
  return: IoScanOutline,
  payment: IoCardOutline,
}

function NotificationItem({
  item,
  onClick,
  onMarkRead,
  compact,
}: {
  item: AppNotification
  onClick?: () => void
  onMarkRead?: (id: number) => void
  compact?: boolean
}) {
  const Icon = kindIcon[item.kind]

  return (
    <div className={`flex items-start gap-2 ${item.read ? "" : "bg-accent/50"}`}>
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex flex-1 min-w-0 gap-3 ${compact ? "p-3" : "p-4"}`}
      >
        <div className="relative shrink-0">
          <img
            src={item.image}
            alt=""
            className={`${compact ? "size-11" : "size-14"} rounded-xl object-cover`}
          />
          <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary text-white flex items-center justify-center">
            <Icon className="size-3" />
          </span>
        </div>
        <div className="min-w-0">
          <div className={`${compact ? "text-sm" : "font-medium"}`}>{item.message}</div>
          <div className="text-xs md:text-sm text-muted">{item.time}</div>
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
