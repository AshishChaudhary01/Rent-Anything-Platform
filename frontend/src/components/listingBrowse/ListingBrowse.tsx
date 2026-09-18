import { useEffect, useMemo, useState } from "react"
import RaSearchBar from "../searchbar/RaSearchbar"
import RaItemPreviewCard from "../card/RaItemPreviewCard"
import RaButton from "../button/RaButton"
import { PAGE_SIZE, filterByPrice, sortCatalog, type CatalogItem } from "../../data/catalog"
import { categories } from "../categoryBar/CategoryBar"

const selectClass = "bg-surface border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"

function ListingBrowse({
  title,
  subtitle,
  items,
  showCategoryFilter = false,
  initialQuery = "",
}: {
  title: string
  subtitle?: string
  items: CatalogItem[]
  showCategoryFilter?: boolean
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState("newest")
  const [price, setPrice] = useState("all")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setQuery(initialQuery)
    setPage(1)
  }, [initialQuery])

  const filtered = useMemo(() => {
    let next = items
    const q = query.trim().toLowerCase()
    if (q) {
      next = next.filter((item) =>
        item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)
      )
    }
    if (showCategoryFilter && category !== "all") {
      next = next.filter((item) => item.category === category)
    }
    next = filterByPrice(next, price)
    return sortCatalog(next, sort)
  }, [items, query, sort, price, category, showCategoryFilter])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const resetPage = () => setPage(1)

  return (
    <div className="flex flex-col gap-y-6 pb-24">
      <div>
        <div className="text-xl md:text-2xl font-bold">{title}</div>
        {subtitle && <div className="text-sm md:text-base font-light text-muted">{subtitle}</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText="Search items..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              resetPage()
            }}
          />
        </div>
        {showCategoryFilter && (
          <select className={selectClass} value={category} onChange={(e) => { setCategory(e.target.value); resetPage() }}>
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.path.split("/").pop()}>{cat.name}</option>
            ))}
          </select>
        )}
        <select className={selectClass} value={price} onChange={(e) => { setPrice(e.target.value); resetPage() }}>
          <option value="all">Any price</option>
          <option value="under-500">Under Nrs. 500</option>
          <option value="500-1500">Nrs. 500 - 1,500</option>
          <option value="over-1500">Over Nrs. 1,500</option>
        </select>
        <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); resetPage() }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-high">Price: High</option>
          <option value="price-low">Price: Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="text-sm text-muted">{filtered.length} items</div>

      {slice.length === 0 ? (
        <div className="text-muted py-10 text-center">No items match these filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {slice.map((item) => (
            <RaItemPreviewCard key={item.id} item={item} styleClass="w-full!" />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <div className="w-28">
            <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={current === 1} clickFunc={() => setPage(current - 1)} />
          </div>
          <div className="text-sm font-medium">
            {current} / {pages}
          </div>
          <div className="w-28">
            <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={current === pages} clickFunc={() => setPage(current + 1)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingBrowse
