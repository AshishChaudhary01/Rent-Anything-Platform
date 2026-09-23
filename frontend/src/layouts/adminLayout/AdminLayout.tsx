import { Navigate, Outlet } from "react-router-dom"
import AdminShell from "../../components/admin/AdminShell"
import RequireAuth from "../../components/auth/RequireAuth"

function AdminLayout() {
  return (
    <RequireAuth admin>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </RequireAuth>
  )
}

export default AdminLayout
