import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IoBagHandleOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import { runConfirmedAction } from "../../../lib/criticalAction"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { useAdminListings, useSetAdminListingStatus } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminListings() {
  const { data: listings = [], isPending } = useAdminListings()
  const setListingStatus = useSetAdminListingStatus()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchesQuery = matchesSearch(query, item.id, item.title, item.ownerName, item.ownerId, item.location, item.category)
      const matchesStatus = status === "All" || item.status === status
      return matchesQuery && matchesStatus
    })
  }, [listings, query, status])

  const { current, slice } = paginate(filtered, page)

  const changeStatus = async (id: string, previous: string, next: string, message: string, confirm: { title: string; body: string; confirmText: string }) => {
    await runConfirmedAction({
      confirm: { ...confirm, danger: true },
      run: () => setListingStatus.mutateAsync({ id, status: next }),
      success: message,
      undo: () => setListingStatus.mutateAsync({ id, status: previous }),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader icon={IoBagHandleOutline} title="Listings" subtitle="Search by listing ID, title, owner, or location." />

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

      {isPending ? (
        <RaPageLoader label="Loading listings…" />
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((item) => (
            <RaCard key={item.id} round="round" styleClass="p-4! flex flex-col md:flex-row md:items-center gap-4">
              <img src={item.image} alt="" className="size-16 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{item.title}</div>
                <div className="text-sm text-muted">#{item.id.slice(0, 8)} · {item.ownerName} · {item.location} · Nrs. {item.rate}/day</div>
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
                    clickFunc={() => void changeStatus(item.id, item.status, "Disabled", "Listing disabled", { title: "Disable this listing?", body: `${item.title} will be hidden from browse until restored.`, confirmText: "Disable" })}
                  />
                )}
                {item.status !== "Removed" && (
                  <RaButton
                    type="button"
                    btnText="Remove"
                    size="sm"
                    variant="danger"
                    widthFill={false}
                    clickFunc={() => void changeStatus(item.id, item.status, "Removed", "Listing removed", { title: "Remove this listing?", body: `${item.title} will be taken down. You can undo this from the toast if it was a mistake.`, confirmText: "Remove" })}
                  />
                )}
              </div>
            </RaCard>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted">No listings match that search.</div>}
        </div>
      )}

      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminListings
