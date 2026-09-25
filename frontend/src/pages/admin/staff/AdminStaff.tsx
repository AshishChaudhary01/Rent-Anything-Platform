import { useMemo, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { IoPersonAddOutline, IoShieldOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import AdminPagination from "../../../components/admin/AdminPagination"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { profile01 } from "../../../utils/images"
import { useAuthStore } from "../../../store/authStore"
import { useAdminStaff } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminStaff() {
  const role = useAuthStore((s) => s.role)
  const { data: staff = [], isPending } = useAdminStaff()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return staff.filter((user) => {
      const matchesQuery = matchesSearch(query, user.id, user.fullName, user.email, user.phone)
      const matchesStatus =
        status === "All"
        || (status === "Active" ? user.status === "Active" : user.status !== "Active")
      return matchesQuery && matchesStatus
    })
  }, [staff, query, status])

  const { current, slice } = paginate(filtered, page)

  if (role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/settings" replace />
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <AdminPageHeader
        icon={IoShieldOutline}
        title="Admins"
        subtitle="Update, disable, or remove RAP admin accounts. Super admins are not listed here."
        actions={
          <Link to="/admin/staff/new">
            <RaButton type="button" btnText="Add admin" size="sm" widthFill={false} icon={<IoPersonAddOutline />} iconPosition="left" />
          </Link>
        }
      />

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar placeholderText="Search by name, email, or phone..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} suggestions={false} />
        </div>
        <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      {isPending ? (
        <RaPageLoader label="Loading admins…" />
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((user) => (
            <RaCard key={user.id} round="round" styleClass="p-4! flex items-center gap-4">
              <img src={user.avatarUrl || profile01} alt="" className="size-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{user.fullName}</div>
                <div className="text-sm text-muted truncate">{user.email} · {user.phone || "No phone"} · joined {user.joined}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.status === "Active" ? "Active" : "Disabled")}`}>{user.status === "Active" ? "Active" : "Disabled"}</span>
              <Link to={`/admin/staff/${user.id}`}>
                <RaButton type="button" btnText="Manage" size="sm" variant="outline" widthFill={false} />
              </Link>
            </RaCard>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted">No admin accounts match.</div>}
        </div>
      )}
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminStaff
