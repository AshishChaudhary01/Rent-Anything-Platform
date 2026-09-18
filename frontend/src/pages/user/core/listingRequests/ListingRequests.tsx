import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { IoCalendarOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { listingRequests } from "../../../../data/listingRequests"
import { PAGE_SIZE } from "../../../../data/catalog"
import { profile01 } from "../../../../utils/images"

const selectClass = "bg-surface border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

function ListingRequests() {
  const [params] = useSearchParams()
  const listingParam = params.get("listing") || ""
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let items = listingRequests.filter((req) => {
      const haystack = `${req.name} ${req.listing}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesListing = listingParam
        ? req.listing.toLowerCase().includes(listingParam.toLowerCase())
        : true
      return matchesQuery && matchesListing
    })
    if (status !== "All") items = items.filter((req) => req.status === status)
    if (sort === "newest") items = [...items].sort((a, b) => b.id - a.id)
    if (sort === "oldest") items = [...items].sort((a, b) => a.id - b.id)
    if (sort === "price-high") items = [...items].sort((a, b) => b.amountValue - a.amountValue)
    if (sort === "price-low") items = [...items].sort((a, b) => a.amountValue - b.amountValue)
    if (sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [listingParam, query, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const breadcrumb = listingParam
    ? [
        { label: "My Listings", path: "/user/my-listings" },
        { label: "My Listing Details", path: "/user/my-listing-details" },
        { label: "My Requests" },
      ]
    : [
        { label: "My Listings", path: "/user/my-listings" },
        { label: "My Requests" },
      ]

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-24">
          <RaBreadcrumb items={breadcrumb} />

          <div>
            <div className="text-xl md:text-2xl font-bold">My Requests</div>
            <div className="text-sm md:text-base font-light text-muted">
              {listingParam
                ? `Incoming rental requests for ${listingParam}.`
                : "Manage incoming rental requests for all of your listings."}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar
                placeholderText="Search by requester name or listing..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                suggestions={false}
              />
            </div>
            <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
            <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High</option>
              <option value="price-low">Price: Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {slice.length === 0 ? (
            <div className="text-muted py-8 text-center">No requests match your search.</div>
          ) : (
            <div className={gridClass}>
              {slice.map((req) => (
                <RaCard key={req.id} round="round" styleClass="flex flex-col gap-4 p-4!">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={profile01} alt="" className="size-10 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{req.name}</div>
                        <div className="text-xs text-muted">{req.time}</div>
                      </div>
                    </div>
                    <RaBadge
                      badgeText={req.status.toUpperCase()}
                      size="sm"
                      variant={req.status === "Accepted" ? "accent" : "primary"}
                      styleClass={`shrink-0 ${req.status === "Declined" ? "opacity-70" : ""}`}
                    />
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <img src={req.listingImage} alt="" className="size-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{req.listing}</div>
                      <div className="flex gap-6 text-xs text-muted mt-1">
                        <div>
                          <div className="uppercase tracking-wide">Duration</div>
                          <div className="font-semibold text-text-dark">{req.duration}</div>
                        </div>
                        <div>
                          <div className="uppercase tracking-wide">Total</div>
                          <div className="font-semibold text-text-dark">{req.amount}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to={`/user/request-details/${req.id}`}>
                      <RaButton type="button" btnText="View Details" size="sm" variant="outline" />
                    </Link>
                    {req.status === "Pending" && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <RaButton type="button" btnText="Accept" size="sm" />
                        </div>
                        <RaButton type="button" btnText="Reject" size="sm" variant="danger" widthFill={false} />
                      </div>
                    )}
                    {req.status === "Accepted" && (
                      <Link to="/user/rental-details">
                        <RaButton
                          type="button"
                          btnText="Manage Booking"
                          size="sm"
                          variant="outline"
                          icon={<IoCalendarOutline />}
                          iconPosition="left"
                        />
                      </Link>
                    )}
                  </div>
                </RaCard>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-28">
                <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={current === 1} clickFunc={() => setPage(current - 1)} />
              </div>
              <div className="text-sm font-medium">{current} / {pages}</div>
              <div className="w-28">
                <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={current === pages} clickFunc={() => setPage(current + 1)} />
              </div>
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default ListingRequests
