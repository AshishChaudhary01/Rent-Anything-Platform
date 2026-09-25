import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { IoSwapHorizontalOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { useAdminRentals } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminRentals() {
  const { data: rentals = [], isPending } = useAdminRentals()
  const [params, setParams] = useSearchParams()
  const status = params.get("status") || "All"
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return rentals.filter((item) => {
      const matchesQuery = matchesSearch(
        query,
        item.id,
        item.listingId,
        item.listingTitle,
        item.ownerId,
        item.ownerName,
        item.renterId,
        item.renterName,
      )
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [rentals, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader icon={IoSwapHorizontalOutline} title="Rentals" subtitle="Search by rental ID, listing, owner, or renter." />
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText="Search by rental ID, listing, or people..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            suggestions={false}
          />
        </div>
        <select
          className={selectClass}
          value={status}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value === "All") next.delete("status")
            else next.set("status", e.target.value)
            setParams(next)
            setPage(1)
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {isPending ? (
        <RaPageLoader label="Loading rentals…" />
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((rental) => (
            <RaCard key={rental.id} round="round" styleClass="p-4! flex items-center gap-4">
              <img src={rental.image} alt="" className="size-14 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{rental.listingTitle}</div>
                <div className="text-sm text-muted truncate">{rental.id.slice(0, 8)} · {rental.renterName} → {rental.ownerName}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(rental.status)}`}>{rental.status}</span>
              <Link to={`/admin/rentals/${rental.id}`}>
                <RaButton type="button" btnText="View" size="sm" variant="outline" widthFill={false} />
              </Link>
            </RaCard>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted">No rentals match that search.</div>}
        </div>
      )}
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminRentals
