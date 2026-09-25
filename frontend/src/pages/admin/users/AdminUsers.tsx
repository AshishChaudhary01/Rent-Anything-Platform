import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IoPeopleOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { profile01 } from "../../../utils/images"
import { useAdminUsers } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminUsers() {
  const { data: users = [], isPending } = useAdminUsers()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = matchesSearch(query, user.id, user.fullName, user.email, user.phone, user.location)
      const matchesStatus = status === "All" || user.status === status
      return matchesQuery && matchesStatus && user.role === "USER"
    })
  }, [users, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader icon={IoPeopleOutline} title="Users" subtitle="Search by user ID, name, email, or phone." />
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar placeholderText="Search by ID, name, email, or phone..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} suggestions={false} />
        </div>
        <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Banned">Banned</option>
        </select>
      </div>
      {isPending ? (
        <RaPageLoader label="Loading users…" />
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((user) => (
            <RaCard key={user.id} round="round" styleClass="p-4! flex items-center gap-4">
              <img src={user.avatarUrl || profile01} alt="" className="size-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{user.fullName}</div>
                <div className="text-sm text-muted truncate">{user.id} · {user.email} · {user.location}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.status)}`}>{user.status}</span>
              <Link to={`/admin/users/${user.id}`}>
                <RaButton type="button" btnText="Profile" size="sm" variant="outline" widthFill={false} />
              </Link>
            </RaCard>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted">No users match that search.</div>}
        </div>
      )}
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminUsers
