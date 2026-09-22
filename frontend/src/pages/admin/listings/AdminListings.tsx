import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import { useAdminStore } from "../../../store/adminStore"
import { raToast } from "../../../lib/raToast"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"

function AdminListings() {
  const listings = useAdminStore((s) => s.listings)
  const setListingStatus = useAdminStore((s) => s.setListingStatus)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchesQuery = matchesSearch(query, item.id, `#${item.id}`, item.title, item.ownerName, item.ownerId, item.location, item.category)
      const matchesStatus = status === "All" || item.status === status
      return matchesQuery && matchesStatus
    })
  }, [listings, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">Listings</div>
        <div className="text-sm text-muted">Search by listing ID, title, owner, or location.</div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText="Search by ID, title, owner, or location..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            suggestions={false}
          />
        </div>
        <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
          <option value="Removed">Removed</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {slice.map((item) => (
          <RaCard key={item.id} round="round" styleClass="p-4! flex flex-col md:flex-row md:items-center gap-4">
            <img src={item.image} alt="" className="size-16 rounded-xl object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{item.title}</div>
              <div className="text-sm text-muted">#{item.id} · {item.ownerName} · {item.location} · Nrs. {item.rate}/day</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(item.status)}`}>{item.status}</span>
            <div className="flex flex-wrap gap-2">
              <Link to={`/admin/listings/${item.id}`}>
                <RaButton type="button" btnText="Details" size="sm" variant="outline" widthFill={false} />
              </Link>
              {item.status === "Active" && (
                <RaButton
                  type="button"
                  btnText="Disable"
                  size="sm"
                  variant="outline"
                  widthFill={false}
                  clickFunc={() => { setListingStatus(item.id, "Disabled"); raToast.warning("Listing disabled") }}
                />
              )}
              {item.status !== "Removed" && (
                <RaButton
                  type="button"
                  btnText="Remove"
                  size="sm"
                  variant="danger"
                  widthFill={false}
                  clickFunc={() => { setListingStatus(item.id, "Removed"); raToast.success("Listing removed") }}
                />
              )}
            </div>
          </RaCard>
        ))}
        {filtered.length === 0 && <div className="text-sm text-muted">No listings match that search.</div>}
      </div>

      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminListings
