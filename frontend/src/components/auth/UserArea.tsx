import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

function UserArea({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const role = useAuthStore((s) => s.role)

  if (accessToken && role && role !== "USER") {
    return <Navigate to="/admin" replace />
  }

  return children
}

export function RequireAuth({
  children,
  admin,
}: {
  children: React.ReactNode
  admin?: boolean
}) {
  const location = useLocation()
  const accessToken = useAuthStore((s) => s.accessToken)
  const role = useAuthStore((s) => s.role)

  if (!accessToken) {
    const from = `${location.pathname}${location.search}`
    sessionStorage.setItem("rap-next", from)
    return <Navigate to="/auth/login" replace state={{ from }} />
  }

  if (admin && role === "USER") {
    return <Navigate to="/user" replace />
  }

  if (!admin && role && role !== "USER") {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default UserArea
