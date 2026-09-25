import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IoCalendarOutline, IoStarOutline, IoTimeOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import RaBadge from "../../../../components/badge/RaBadge"
import StarRating from "../../../../components/rating/StarRating"
import { useMyRentals } from "../../../../hooks/queries/useRentals"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"

function RentalHistory() {
  const { data: rentals = [], isPending } = useMyRentals()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const past = rentals.filter((item) => item.status === "COMPLETED" || item.status === "CANCELLED" || item.status === "DECLINED")

  const filtered = useMemo(() => {
    let items = past.filter((item) => item.listingTitle.toLowerCase().includes(query.toLowerCase()))
    if (sort === "newest") items = [...items].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    if (sort === "oldest") items = [...items].sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""))
    if (sort === "price-high") items = [...items].sort((a, b) => Number(b.rentalTotal) - Number(a.rentalTotal))
    if (sort === "price-low") items = [...items].sort((a, b) => Number(a.rentalTotal) - Number(b.rentalTotal))
    if (sort === "name") items = [...items].sort((a, b) => a.listingTitle.localeCompare(b.listingTitle))
    return items
  }, [past, query, sort])

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-8">
          <RaBreadcrumb items={[{ label: "My Rentals", path: "/user/my-rentals" }, { label: "Rental History" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Rental history</div>
            <div className="text-sm text-muted">Completed, cancelled, and declined rentals.</div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar placeholderText="Search past rentals..." value={query} onChange={(e) => setQuery(e.target.value)} suggestions={false} />
            </div>
            <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High</option>
              <option value="price-low">Price: Low</option>
              <option value="name">Name</option>
            </select>
          </div>
          {isPending && <RaPageLoader />}
          {!isPending && filtered.length === 0 && (
            <div className="text-muted py-8 text-center">No past rentals match your search.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <RaCard key={item.id} round="round" bg={item.status === "COMPLETED" ? "success" : "white"} styleClass="flex flex-col p-4!">
                <Link to={`/user/rental-details?rentalId=${item.id}`} className="flex gap-3 items-center">
                  <img src={item.listingImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-base truncate">{item.listingTitle}</div>
                      <RaBadge
                        badgeText={item.status === "COMPLETED" ? "Completed" : item.status === "DECLINED" ? "Declined" : "Cancelled"}
                        size="sm"
                        variant={item.status === "COMPLETED" ? "success" : "accent"}
                      />
                    </div>
                    <div className="flex items-center gap-x-2 text-xs text-muted mt-0.5">
                      <IoCalendarOutline className="size-3.5 text-primary" />
                      <span>{item.startDate}</span>
                      <IoTimeOutline className="size-3.5 text-primary ml-2" />
                      <span>{item.days}d</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-end justify-between mt-4">
                  <div className="font-bold text-primary text-sm">Nrs. {Number(item.rentalTotal).toLocaleString()}</div>
                  {item.myRating ? (
                    <div className="flex flex-col items-end gap-1">
                      <StarRating value={item.myRating} readOnly size="sm" showValue />
                      <Link to={`/user/rent/rate?rentalId=${item.id}`} className="text-xs font-bold text-primary">Edit</Link>
                    </div>
                  ) : item.canReview ? (
                    <Link to={`/user/rent/rate?rentalId=${item.id}`} className="text-xs font-bold text-success flex items-center gap-1">
                      <IoStarOutline /> Rate
                    </Link>
                  ) : (
                    <Link to={`/user/rental-details?rentalId=${item.id}`} className="text-xs font-bold text-primary">Details</Link>
                  )}
                </div>
              </RaCard>
            ))}
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RentalHistory
