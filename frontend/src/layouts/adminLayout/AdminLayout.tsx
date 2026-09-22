import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import AdminShell from "../../components/admin/AdminShell"

function AdminLayout() {
  const role = useAuthStore((s) => s.role)

  if (!role) return <Navigate to="/auth/login" replace />
  if (role === "USER") return <Navigate to="/user" replace />

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}

export default AdminLayout
