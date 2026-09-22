import { Link, useLocation } from "react-router-dom"
import { IoChevronForward, IoHomeOutline } from "react-icons/io5"

const ROLE_HOME: Record<string, { label: string; path: string }> = {
  user: { label: "Home", path: "/user" },
  admin: { label: "Admin", path: "/admin" },
}

function crumbLabel(raw: string) {
  const decoded = decodeURIComponent(raw)
  if (/^(u-|RA-|RP-|KYC-|#)/i.test(decoded) || /^\d+$/.test(decoded)) return decoded
  return decoded.replace(/-/g, " ")
}

function RaBreadcrumb({
  items,
}: {
  items?: { label: string; path?: string }[]
}) {
  const location = useLocation()
  const role = location.pathname.split("/").filter(Boolean)[0]
  const home = ROLE_HOME[role] || { label: "Home", path: "/" }

  const trail = items
    ? [home, ...items]
    : (() => {
        const segments = location.pathname.split("/").filter(Boolean)
        return [
          home,
          ...segments.slice(1).map((seg, i, arr) => ({
            label: crumbLabel(seg),
            path: i === arr.length - 1 ? undefined : "/" + segments.slice(0, i + 2).join("/"),
          })),
        ]
      })()

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm">
      {trail.map((crumb, i) => {
        const isLast = i === trail.length - 1
        const clickable = !isLast && Boolean(crumb.path)
        return (
          <div key={`${crumb.label}-${i}`} className="flex items-center gap-1 min-w-0">
            {i > 0 && <IoChevronForward className="size-3.5 text-muted shrink-0" />}
            {clickable ? (
              <Link
                to={crumb.path!}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-muted hover:bg-primary/10 hover:text-primary capitalize"
              >
                {i === 0 && <IoHomeOutline className="size-4" />}
                <span className="truncate max-w-40">{crumb.label}</span>
              </Link>
            ) : (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 capitalize ${isLast ? "bg-surface text-text-dark font-medium" : "text-muted"}`}>
                {i === 0 && <IoHomeOutline className="size-4" />}
                <span className="truncate max-w-56">{crumb.label}</span>
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default RaBreadcrumb
