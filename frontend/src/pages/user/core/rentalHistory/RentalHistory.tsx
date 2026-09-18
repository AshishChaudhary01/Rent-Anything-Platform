import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { pastRentals } from "../../../../data/pastRentals"

const detailsPath = "/user/rental-details"
const selectClass = "bg-surface border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"

function RentalHistory() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")

  const filtered = useMemo(() => {
    let items = pastRentals.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
    if (sort === "newest") items = [...items].sort((a, b) => b.id - a.id)
    if (sort === "oldest") items = [...items].sort((a, b) => a.id - b.id)
    if (sort === "price-high") items = [...items].sort((a, b) => b.amountValue - a.amountValue)
    if (sort === "price-low") items = [...items].sort((a, b) => a.amountValue - b.amountValue)
    if (sort === "name") items = [...items].sort((a, b) => a.title.localeCompare(b.title))
    return items
  }, [query, sort])

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-8">
          <RaBreadcrumb items={[
            { label: "My Rentals", path: "/user/my-rentals" },
            { label: "Rental History" },
          ]} />

          <div>
            <div className="text-xl md:text-2xl font-bold">Rental History</div>
            <div className="text-sm md:text-base font-light text-muted">Past rentals you have completed on RAP.</div>
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

          {filtered.length === 0 && (
            <div className="text-muted py-8 text-center">No past rentals match your search.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <RaCard key={item.id} round="round" styleClass="flex flex-col p-4!">
                <Link to={detailsPath} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{item.title}</div>
                    <div className="flex items-center gap-x-2 text-xs text-muted mt-0.5">
                      <IoCalendarOutline className="size-3.5 text-primary" />
                      <span>{item.date}</span>
                      <IoTimeOutline className="size-3.5 text-primary ml-2" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-end justify-between mt-4">
                  <div className="font-bold text-primary text-sm">{item.amount}</div>
                  <Link to={detailsPath} className="text-xs font-bold text-primary whitespace-nowrap">
                    MORE DETAILS
                  </Link>
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
