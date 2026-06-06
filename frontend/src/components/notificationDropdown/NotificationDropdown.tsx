import { useEffect, useRef, useState } from "react";
import { IoCheckmarkOutline, IoChevronForwardOutline, IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your booking request was approved.",
      read: true,
    },
    {
      id: 2,
      message: "New message from John.",
      read: false,
    },
    {
      id: 3,
      message: "Rental period ends tomorrow.",
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 top-1"
      >
        <IoNotificationsOutline className="size-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-12 -right-14 mt-2 w-80 rounded-xl bg-white border-t border-gray-200 shadow-lg z-50">
          {/* Header */}
          <div className="text-gray-500 rounded-t-xl flex items-center justify-between border-b border-border p-4">
            <h3 className="font-bold">
              Notifications
            </h3>

            <button
              onClick={markAllAsRead}
              className="text-xs hover:underline flex items-end gap-x-2"
            >
              <IoCheckmarkOutline className="size-4" />
              <p>Mark all as read</p>
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-t border-white p-4 ${!notification.read
                    ? "bg-accent/50"
                    : ""
                    }`}
                >

                  <p className="text-sm">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* View all */}
          <Link to={"/user"} className="m-2 p-3 rounded-sm bg-gray-100 text-xs text-muted font-semibold flex justify-center gap-x-2">View all notifications <IoChevronForwardOutline /></Link>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;