import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline, IoBagHandleOutline, IoSwapHorizontalOutline } from "react-icons/io5"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { useAdminListings, useAdminRentals, useAdminUser } from "../../../hooks/queries/useAdmin"

function AdminUserActivity({ kind }: { kind: "listings" | "rentals" }) {
  const { id } = useParams()
  const { data: user, isPending } = useAdminUser(id)
  const { data: listings = [] } = useAdminListings()
  const { data: rentals = [] } = useAdminRentals()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const listingItems = useMemo(() => {
    if (!user) return []
    return listings.filter((item) => {
      if (item.ownerId !== user.id) return false
      const matchesQuery = matchesSearch(query, item.id, item.title, item.location, item.category)
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [listings, user, query, status])

  const rentalItems = useMemo(() => {
    if (!user) return []
    return rentals.filter((item) => {
      if (item.ownerId !== user.id && item.renterId !== user.id) return false
      const matchesQuery = matchesSearch(query, item.id, item.listingTitle, item.ownerName, item.renterName, item.listingId)
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [rentals, user, query, status])

  if (isPending) {
    return <div className="text-muted">Loading…</div>
  }

  if (!user) {
    return <div className="text-muted">User not found. <Link to="/admin/users" className="text-primary">Back</Link></div>
  }

  const { current } = kind === "listings" ? paginate(listingItems, page) : paginate(rentalItems, page)
  const listingSlice = paginate(listingItems, page).slice
  const rentalSlice = paginate(rentalItems, page).slice
  const title = kind === "listings" ? "Listings" : "Rentals"

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/admin/users/${user.id}`} className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> {user.fullName}
      </Link>
      <AdminPageHeader
        icon={kind === "listings" ? IoBagHandleOutline : IoSwapHorizontalOutline}
        title={`${user.fullName} · ${title}`}
        subtitle={`Search and filter this user’s ${kind}.`}
      />
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText={kind === "listings" ? "Search by listing ID or title..." : "Search by rental ID or listing..."}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            suggestions={false}
          />
        </div>
        <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option value="All">All statuses</option>
          {kind === "listings" ? (
            <>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Removed">Removed</option>
            </>
          ) : (
            <>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </>
          )}
        </select>
      </div>
      <div className="flex flex-col gap-3">
        {kind === "listings"
          ? listingSlice.map((listing) => (
                <RaCard key={listing.id} round="round" styleClass="p-4! flex items-center gap-4">
                  <img src={listing.image} alt="" className="size-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{listing.title}</div>
                    <div className="text-sm text-muted">#{listing.id.slice(0, 8)} · {listing.location}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(listing.status)}`}>{listing.status}</span>
                  <Link to={`/admin/listings/${listing.id}`}>
                    <RaButton type="button" btnText="View" size="sm" variant="outline" widthFill={false} />
                  </Link>
                </RaCard>
              ))
          : rentalSlice.map((rental) => (
                <RaCard key={rental.id} round="round" styleClass="p-4! flex items-center gap-4">
                  <img src={rental.image} alt="" className="size-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{rental.listingTitle}</div>
                    <div className="text-sm text-muted">{rental.id.slice(0, 8)} · {rental.startDate} → {rental.endDate}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(rental.status)}`}>{rental.status}</span>
                  <Link to={`/admin/rentals/${rental.id}`}>
                    <RaButton type="button" btnText="View" size="sm" variant="outline" widthFill={false} />
                  </Link>
                </RaCard>
              ))}
        {(kind === "listings" ? listingItems : rentalItems).length === 0 && <div className="text-sm text-muted">Nothing matches that search.</div>}
      </div>
      <AdminPagination page={current} total={(kind === "listings" ? listingItems : rentalItems).length} onPage={setPage} />
    </div>
  )
}

export default AdminUserActivity
