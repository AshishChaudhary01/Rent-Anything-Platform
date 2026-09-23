import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

function RequireAuth({
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
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  if (admin && role === "USER") {
    return <Navigate to="/user" replace />
  }

  if (!admin && role && role !== "USER") {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RequireAuth
