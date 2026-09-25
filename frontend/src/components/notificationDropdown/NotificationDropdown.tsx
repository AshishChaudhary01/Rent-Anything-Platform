import { useEffect, useRef, useState } from "react";
import { IoCheckmarkOutline, IoChevronForwardOutline, IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../../hooks/queries/useNotifications";
import { useAuthStore } from "../../store/authStore";

const NotificationDropdown = () => {
  const role = useAuthStore((s) => s.role);
  const inbox = role === "USER" ? "/user/notifications" : "/admin/notifications";
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useNotifications(0, 4);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const items = data?.items ?? [];
  const unreadCount = data?.unread ?? 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen((prev) => !prev)} className="relative p-2 top-1">
        <IoNotificationsOutline className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-12 -right-14 mt-2 w-80 rounded-xl bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="text-gray-500 rounded-t-xl flex items-center justify-between border-b border-border p-4">
            <h3 className="font-bold">Notifications</h3>
            <button
              onClick={() => markAll.mutate()}
              className="text-xs hover:underline flex items-end gap-x-2"
            >
              <IoCheckmarkOutline className="size-4" />
              <p>Mark all as read</p>
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted">No notifications</div>
            ) : (
              items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  item={notification}
                  compact
                  onClick={() => setIsOpen(false)}
                  onMarkRead={(id) => markRead.mutate(id)}
                />
              ))
            )}
          </div>
          <Link to={inbox} onClick={() => setIsOpen(false)} className="m-2 p-3 rounded-sm bg-gray-100 text-xs text-muted font-semibold flex justify-center gap-x-2">
            View all notifications <IoChevronForwardOutline />
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
