import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { IoCheckmarkOutline, IoClose } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { PAGE_SIZE } from "../../../../data/catalog"
import { raToast } from "../../../../lib/raToast"
import { useAcceptRental, useDeclineRental, useOwnedRentals } from "../../../../hooks/queries/useRentals"
import type { Rental, RentalStatus } from "../../../../types/rental.types"
import {
  ownerDetailsPath,
  requestCardAction,
  requestCardLabel,
} from "./ownerRequestProgress"

const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

function badgeVariant(status: RentalStatus) {
  if (status === "REQUESTED") return "warning" as const
  if (status === "DECLINED" || status === "CANCELLED") return "accent" as const
  if (status === "COMPLETED" || status === "PAID" || status === "MEETUP_CONFIRMED") return "success" as const
  if (status === "ACTIVE") return "warning" as const
  return "primary" as const
}

function ListingRequests() {
  const [params] = useSearchParams()
  const listingId = params.get("listingId") || ""
  const listingTitle = params.get("listing") || ""
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const { data: owned = [], isPending } = useOwnedRentals()
  const accept = useAcceptRental()
  const decline = useDeclineRental()

  const filtered = useMemo(() => {
    let items = owned.filter((req) => {
      const haystack = `${req.renterName} ${req.listingTitle}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesListing = listingId
        ? req.listingId === listingId
        : listingTitle
          ? req.listingTitle.toLowerCase().includes(listingTitle.toLowerCase())
          : true
      return matchesQuery && matchesListing
    })
    if (status !== "All") items = items.filter((req) => requestCardLabel(req.status) === status)
    if (sort === "newest") items = [...items].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    if (sort === "oldest") items = [...items].sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""))
    if (sort === "price-high") items = [...items].sort((a, b) => Number(b.rentalTotal) - Number(a.rentalTotal))
    if (sort === "price-low") items = [...items].sort((a, b) => Number(a.rentalTotal) - Number(b.rentalTotal))
    if (sort === "name") items = [...items].sort((a, b) => a.renterName.localeCompare(b.renterName))
    return items
  }, [owned, listingId, listingTitle, query, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const breadcrumb = [
    { label: "My Listings", path: "/user/my-listings" },
    { label: "My Requests" },
  ]

  const decide = (req: Rental, next: "accept" | "decline") => {
    const run = next === "accept" ? accept : decline
    run.mutate(req.id, {
      onSuccess: () => raToast.success(next === "accept" ? `Accepted ${req.renterName}` : `Declined ${req.renterName}`),
      onError: (error) => raToast.fromError(error, "Could not update request"),
    })
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-24">
          <RaBreadcrumb items={breadcrumb} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Listing requests</div>
            <div className="text-sm md:text-base font-light text-muted">
              Tap a request to see where it is in the rental process.
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar
                placeholderText="Search by renter or listing..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                suggestions={false}
              />
            </div>
            <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Waiting for payment">Waiting for payment</option>
              <option value="Ready for pickup">Ready for pickup</option>
              <option value="Active rental">Active rental</option>
              <option value="Completed">Completed</option>
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

          {isPending ? (
            <div className="text-muted py-8 text-center">Loading requests…</div>
          ) : slice.length === 0 ? (
            <div className="text-muted py-8 text-center">No requests match your search.</div>
          ) : (
            <div className={gridClass}>
              {slice.map((req) => (
                <RaCard key={req.id} round="round" bg={req.status === "REQUESTED" ? "warning" : "white"} styleClass="flex flex-col gap-4 p-4!">
                  <Link to={ownerDetailsPath(req.id)} className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {req.renterAvatarUrl ? (
                          <img src={req.renterAvatarUrl} alt="" className="size-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="size-10 rounded-full bg-surface shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{req.renterName}</div>
                          <div className="text-xs text-muted">{req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}</div>
                        </div>
                      </div>
                      <RaBadge badgeText={requestCardLabel(req.status)} size="sm" variant={badgeVariant(req.status)} />
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={req.listingImage} alt="" className="size-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{req.listingTitle}</div>
                        <div className="text-xs text-muted mt-1">{req.days} day{req.days === 1 ? "" : "s"} · Nrs. {Number(req.rentalTotal).toLocaleString()}</div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <Link to={ownerDetailsPath(req.id)}>
                      <RaButton type="button" btnText={requestCardAction(req.status)} />
                    </Link>
                    {req.status === "REQUESTED" && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <RaButton type="button" btnText="Accept" size="sm" variant="success" icon={<IoCheckmarkOutline />} iconPosition="left" clickFunc={() => decide(req, "accept")} />
                        </div>
                        <RaButton type="button" btnText="Decline" size="sm" variant="danger" widthFill={false} icon={<IoClose />} iconPosition="left" clickFunc={() => decide(req, "decline")} />
                      </div>
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
