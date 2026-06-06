import { useEffect, useRef, useState } from "react";
import { IoCardOutline, IoLockClosedOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface IProfileDropdownProps {
  username: string;
  email: string;
  avatarUrl?: string;
}

const ProfileDropdown = ({
  username,
  email,
  avatarUrl
}: IProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const menuItems = [
    {
      label: "Profile",
      icon: <IoPersonOutline className="size-5" />,
      path: "/profile",
    },
    {
      label: "Payment Methods",
      icon: <IoCardOutline className="size-5" />,
      path: "/payment-methods",
    },
    {
      label: "KYC Verification",
      icon: <IoShieldCheckmarkOutline className="size-5" />,
      path: "/kyc",
    },
    {
      label: "Security",
      icon: <IoLockClosedOutline className="size-5" />,
      path: "/security",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="overflow-hidden rounded-full"
      >
        <img
          src={
            avatarUrl ||
            "https://ui-avatars.com/api/?name=User"
          }
          alt="Profile"
          className="size-10 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg  bg-white border-t border-gray-200 shadow-md">
          {/* User Info */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <img
              src={
                avatarUrl ||
                "https://ui-avatars.com/api/?name=User"
              }
              alt="Profile"
              className="size-12 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">
                {username}
              </p>

              <p className="truncate text-xs text-text-muted">
                {email}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  text-sm
                  hover:bg-surface-soft
                  transition-colors
                "
              >
                <span className="text-text-muted">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown