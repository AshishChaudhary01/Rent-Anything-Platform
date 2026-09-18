import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { backpack01, ladder01, tent01, tools01 } from "../../../../utils/images"

const detailsPath = "/user/my-listing-details"

const listings = [
  { id: 1, image: tools01, title: "Sony WH-1000XM4", note: "Noise cancelling headphones", rate: 800, status: "Available" },
  { id: 2, image: ladder01, title: "Canon EOS R5", note: "Mirrorless camera body", rate: 2500, status: "Rented" },
  { id: 3, image: tent01, title: "North Face Tent", note: "Weatherproof camping gear", rate: 600, status: "Available" },
  { id: 4, image: backpack01, title: "MacBook Pro M1", note: "14-inch Space Gray", rate: 1800, status: "Available" },
]

function MyListings() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("newest")

  const filtered = useMemo(() => {
    let items = listings.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
    if (status !== "All") items = items.filter((item) => item.status === status)
    if (sort === "newest") items = [...items].sort((a, b) => b.id - a.id)
    if (sort === "oldest") items = [...items].sort((a, b) => a.id - b.id)
    if (sort === "price-high") items = [...items].sort((a, b) => b.rate - a.rate)
    if (sort === "price-low") items = [...items].sort((a, b) => a.rate - b.rate)
    if (sort === "name") items = [...items].sort((a, b) => a.title.localeCompare(b.title))
    return items
  }, [query, status, sort])

  const selectClass = "bg-surface border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold">My Listings</div>
              <div className="text-sm md:text-base font-light text-muted">Manage your shared inventory and track your earnings.</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link to="/user/listing-requests">
                <RaButton type="button" btnText="View All Requests" size="sm" variant="outline" widthFill={false} />
              </Link>
              <Link to="/user/add-listing">
                <RaButton type="button" btnText="Add Listing" size="sm" widthFill={false} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <RaCard round="round" bg="accent" styleClass="p-4!">
              <div className="text-xs md:text-sm text-muted">Total Revenue</div>
              <div className="font-bold text-primary text-lg md:text-2xl">Nrs. 45,200</div>
            </RaCard>
            <RaCard round="round" bg="surface" styleClass="p-4!">
              <div className="text-xs md:text-sm text-muted">Listings</div>
              <div className="font-bold text-lg md:text-2xl">{listings.length}</div>
            </RaCard>
            <RaCard round="round" bg="accentSecondary" styleClass="p-4!">
              <div className="text-xs md:text-sm text-muted-secondary">Active Rentals</div>
              <div className="font-bold text-muted-secondary text-lg md:text-2xl">{listings.filter((i) => i.status === "Rented").length}</div>
            </RaCard>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <RaSearchBar placeholderText="Search listings..." value={query} onChange={(e) => setQuery(e.target.value)} suggestions={false} />
            </div>
            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
            <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High</option>
              <option value="price-low">Price: Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="text-lg md:text-xl font-bold">Your Inventory</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <Link key={item.id} to={detailsPath}>
                <RaCard round="round" styleClass="flex gap-4 p-4!">
                  <img src={item.image} alt={item.title} className="size-24 md:size-28 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
                        <RaBadge badgeText={item.status} size="sm" />
                      </div>
                      <div className="text-sm font-light text-muted truncate">{item.note}</div>
                    </div>
                    <div className="font-bold text-primary">Nrs. {item.rate.toLocaleString()} / day</div>
                  </div>
                </RaCard>
              </Link>
            ))}
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyListings
