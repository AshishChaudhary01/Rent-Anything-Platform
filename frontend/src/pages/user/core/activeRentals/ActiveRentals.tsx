import { useMemo, useState } from "react"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import RaButton from "../../../../components/button/RaButton"
import ActiveRentalCard from "../myRentals/ActiveRentalCard"
import { PAGE_SIZE } from "../../../../data/catalog"
import { useMyRentals } from "../../../../hooks/queries/useRentals"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

function ActiveRentals() {
  const { data: rentals = [], isPending } = useMyRentals()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const active = rentals.filter((item) => item.status === "ACTIVE")

  const filtered = useMemo(() => {
    let items = active.filter((item) => item.listingTitle.toLowerCase().includes(query.toLowerCase()))
    if (sort === "newest") items = [...items].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    if (sort === "oldest") items = [...items].sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""))
    if (sort === "name") items = [...items].sort((a, b) => a.listingTitle.localeCompare(b.listingTitle))
    return items
  }, [active, query, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "My Rentals", path: "/user/my-rentals" }, { label: "Active Rentals" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Active rentals</div>
            <div className="text-sm text-muted">Items you currently have on rent.</div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar placeholderText="Search active rentals..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} suggestions={false} />
            </div>
            <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
          {isPending ? <RaPageLoader /> : slice.length === 0 ? (
            <div className="text-muted py-8 text-center">No active rentals match your search.</div>
          ) : (
            <div className={gridClass}>
              {slice.map((item) => (
                <ActiveRentalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    image: item.listingImage,
                    title: item.listingTitle,
                    returns: `Until ${item.endDate}`,
                    amount: `Nrs. ${Number(item.rentalTotal).toLocaleString()}`,
                    returnScheduled: item.returnScheduled,
                  }}
                />
              ))}
            </div>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-28"><RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={current === 1} clickFunc={() => setPage(current - 1)} /></div>
              <div className="text-sm font-medium">{current} / {pages}</div>
              <div className="w-28"><RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={current === pages} clickFunc={() => setPage(current + 1)} /></div>
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default ActiveRentals
