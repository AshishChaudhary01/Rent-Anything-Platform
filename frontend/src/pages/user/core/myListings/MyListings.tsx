import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IoAddOutline, IoCalendarOutline, IoCashOutline, IoCubeOutline, IoListOutline, IoLocationOutline, IoPauseOutline, IoPersonOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { useMyListings } from "../../../../hooks/queries/useListings"
import { useOwnedRentals } from "../../../../hooks/queries/useRentals"
import { listingCover, listingOccupancy, type Listing } from "../../../../types/listing.types"
import { ownerDetailsPath } from "../listingRequests/ownerRequestProgress"

function badgeVariant(key: ReturnType<typeof listingOccupancy>["key"]) {
  if (key === "active") return "warning" as const
  if (key === "busy") return "accent" as const
  if (key === "paused") return "accent" as const
  return "success" as const
}

function occupancyFilter(listing: Listing, status: string) {
  const occupancy = listingOccupancy(listing)
  if (status === "All") return true
  if (status === "Available") return occupancy.key === "open"
  if (status === "Unavailable") return occupancy.key === "paused"
  if (status === "Busy") return occupancy.key === "busy" || occupancy.key === "active"
  return true
}

function MyListings() {
  const { data = [], isPending } = useMyListings()
  const { data: owned = [] } = useOwnedRentals()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("newest")
  const pendingCount = owned.filter((req) => req.status === "REQUESTED").length

  const counts = useMemo(() => {
    const occupancy = data.map(listingOccupancy)
    return {
      total: data.length,
      open: occupancy.filter((item) => item.key === "open").length,
      busy: occupancy.filter((item) => item.key === "busy" || item.key === "active").length,
      active: occupancy.filter((item) => item.key === "active").length,
      paused: occupancy.filter((item) => item.key === "paused").length,
    }
  }, [data])

  const filtered = useMemo(() => {
    let items = data.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    items = items.filter((item) => occupancyFilter(item, status))
    if (sort === "newest") items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === "oldest") items = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    if (sort === "price-high") items = [...items].sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate))
    if (sort === "price-low") items = [...items].sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate))
    if (sort === "name") items = [...items].sort((a, b) => a.title.localeCompare(b.title))
    return items
  }, [data, query, status, sort])

  const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold">My Listings</div>
              <div className="text-sm md:text-base font-light text-muted">Manage inventory, busy dates, and active rentals.</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link to="/user/listing-requests">
                <RaButton
                  type="button"
                  btnText={pendingCount > 0 ? `Requests (${pendingCount})` : "Requests"}
                  size="sm"
                  variant={pendingCount > 0 ? "primary" : "secondary"}
                  widthFill={false}
                  icon={<IoListOutline />}
                  iconPosition="left"
                />
              </Link>
              <Link to="/user/add-listing">
                <RaButton type="button" btnText="Add listing" size="sm" widthFill={false} icon={<IoAddOutline />} iconPosition="left" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <RaCard round="round" bg="accent" styleClass="p-4! flex gap-3 items-start">
              <IoCubeOutline className="size-5 text-primary mt-0.5" />
              <div>
                <div className="text-xs md:text-sm text-muted">Listings</div>
                <div className="font-bold text-primary text-lg md:text-2xl">{counts.total}</div>
              </div>
            </RaCard>
            <RaCard round="round" bg="success" styleClass="p-4! flex gap-3 items-start">
              <IoCubeOutline className="size-5 text-success mt-0.5" />
              <div>
                <div className="text-xs md:text-sm text-muted">Available</div>
                <div className="font-bold text-success text-lg md:text-2xl">{counts.open}</div>
              </div>
            </RaCard>
            <RaCard round="round" bg="warning" styleClass="p-4! flex gap-3 items-start">
              <IoCalendarOutline className="size-5 text-warning mt-0.5" />
              <div>
                <div className="text-xs md:text-sm text-muted">Busy / rented</div>
                <div className="font-bold text-warning text-lg md:text-2xl">{counts.busy}</div>
                <div className="text-[11px] text-muted">{counts.active} actively rented</div>
              </div>
            </RaCard>
            <RaCard round="round" bg="accentSecondary" styleClass="p-4! flex gap-3 items-start">
              <IoPauseOutline className="size-5 text-muted-secondary mt-0.5" />
              <div>
                <div className="text-xs md:text-sm text-muted-secondary">Unavailable</div>
                <div className="font-bold text-muted-secondary text-lg md:text-2xl">{counts.paused}</div>
              </div>
            </RaCard>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar placeholderText="Search listings..." value={query} onChange={(e) => setQuery(e.target.value)} suggestions={false} />
            </div>
            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All statuses</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy / rented</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High</option>
              <option value="price-low">Price: Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="text-lg md:text-xl font-bold">Your inventory</div>
          {isPending ? (
            <div className="text-muted">Loading your listings…</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted">No listings match these filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((item) => {
                const occupancy = listingOccupancy(item)
                const cardBg = occupancy.key === "active" ? "warning" : occupancy.key === "busy" ? "info" : occupancy.key === "paused" ? "accentSecondary" : "white"
                const listingPending = owned.filter((req) => req.listingId === item.id && req.status === "REQUESTED").length
                const booking = item.activeBooking
                return (
                  <RaCard key={item.id} round="round" bg={cardBg} styleClass="flex flex-col gap-3 p-4! h-full">
                    <Link to={`/user/my-listing-details/${item.id}`} className="flex gap-4">
                      <img src={listingCover(item)} alt={item.title} className="size-24 md:size-28 rounded-xl object-cover bg-white shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 gap-2">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
                            <RaBadge badgeText={occupancy.label} size="sm" variant={badgeVariant(occupancy.key)} />
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted truncate">
                            <IoLocationOutline className="size-4 shrink-0" />
                            {item.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <IoCalendarOutline className="size-4 shrink-0 text-primary" />
                            <span className="truncate">{occupancy.detail}</span>
                          </div>
                          {occupancy.renterName && (
                            <div className="flex items-center gap-1 text-sm text-muted truncate">
                              <IoPersonOutline className="size-4 shrink-0" />
                              {occupancy.renterName}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-bold text-primary">
                          <IoCashOutline className="size-4" />
                          Nrs. {Number(item.dailyRate).toLocaleString()} / day
                        </div>
                      </div>
                    </Link>
                    {listingPending > 0 && (
                      <Link to={`/user/listing-requests?listingId=${item.id}`}>
                        <RaButton type="button" btnText={`See ${listingPending} request${listingPending === 1 ? "" : "s"}`} size="sm" />
                      </Link>
                    )}
                    {booking && listingPending === 0 && (
                      <Link to={ownerDetailsPath(booking.rentalId)}>
                        <RaButton type="button" btnText="See rental progress" size="sm" />
                      </Link>
                    )}
                  </RaCard>
                )
              })}
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyListings
