import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  IoAlertCircleOutline,
  IoBagHandleOutline,
  IoCloseOutline,
  IoGridOutline,
  IoIdCardOutline,
  IoMenuOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5"
import { logoHorizontal, profile01 } from "../../utils/images"
import { useAuthStore } from "../../store/authStore"
import { useAdminStore } from "../../store/adminStore"

const links = [
  { to: "/admin", label: "Dashboard", icon: IoGridOutline, end: true },
  { to: "/admin/listings", label: "Listings", icon: IoBagHandleOutline },
  { to: "/admin/users", label: "Users", icon: IoPeopleOutline },
  { to: "/admin/kyc", label: "KYC", icon: IoIdCardOutline },
  { to: "/admin/reports", label: "Reports", icon: IoAlertCircleOutline },
  { to: "/admin/rentals", label: "Rentals", icon: IoSwapHorizontalOutline },
  { to: "/admin/settings", label: "Settings", icon: IoSettingsOutline },
]

function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const userId = useAuthStore((s) => s.userId)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const users = useAdminStore((s) => s.users)
  const me = users.find((u) => u.id === userId)

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface"
            }`
          }
        >
          <link.icon className="size-5" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="h-dvh bg-bg flex overflow-hidden">
      <aside className="hidden lg:flex w-60 shrink-0 h-dvh flex-col bg-white border-r border-gray-100">
        <Link to="/admin" className="h-16 shrink-0 px-4 flex items-center border-b border-gray-100">
          <img src={logoHorizontal} alt="RAP" className="h-10" />
        </Link>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <Link to="/admin/profile" className="shrink-0 p-4 text-xs text-muted border-t border-gray-100 hover:bg-surface flex items-center gap-3">
          <img src={profile01} alt="" className="size-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="truncate">{me?.fullName || "Admin"}</div>
            <div className="font-semibold text-text-dark">{role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</div>
          </div>
        </Link>
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setOpen(false)}>
          <aside className="w-64 h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 shrink-0 px-4 flex items-center justify-between border-b">
              <img src={logoHorizontal} alt="RAP" className="h-9" />
              <button type="button" onClick={() => setOpen(false)} className="cursor-pointer">
                <IoCloseOutline className="size-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
            <Link to="/admin/profile" onClick={() => setOpen(false)} className="shrink-0 p-4 text-xs text-muted border-t border-gray-100 flex items-center gap-3">
              <img src={profile01} alt="" className="size-9 rounded-full object-cover" />
              <div>
                {me?.fullName || "Admin"}
                <div className="font-semibold text-text-dark">{role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</div>
              </div>
            </Link>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 h-dvh flex flex-col">
        <header className="h-16 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6">
          <button type="button" className="lg:hidden cursor-pointer" onClick={() => setOpen(true)}>
            <IoMenuOutline className="size-7" />
          </button>
          <div className="font-semibold hidden lg:block">Admin</div>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/admin/profile" className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
              <img src={profile01} alt="" className="size-8 rounded-full object-cover ring-2 ring-primary/20" />
            </Link>
            <button
              type="button"
              className="text-sm text-primary font-semibold cursor-pointer"
              onClick={() => {
                clearAuth()
                navigate("/auth/login")
              }}
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminShell
