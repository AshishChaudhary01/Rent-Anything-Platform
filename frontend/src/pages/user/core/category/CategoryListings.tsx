import { useParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import ListingBrowse from "../../../../components/listingBrowse/ListingBrowse"
import { categories } from "../../../../components/categoryBar/CategoryBar"
import { useListings } from "../../../../hooks/queries/useListings"
import { toListingCard } from "../../../../types/listing.types"

function CategoryListings() {
  const { slug = "all" } = useParams()
  const category = categories.find((c) => c.path.endsWith(`/${slug}`))
  const title = slug === "all" ? "All listings" : category?.name || "Category"
  const { data, isPending } = useListings({
    category: slug === "all" ? undefined : slug,
    size: 50,
    sort: "newest",
  })
  const items = (data?.items ?? []).map(toListingCard)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-4">
          <RaBreadcrumb items={[{ label: title }]} />
          {isPending ? (
            <div className="text-muted py-10">Loading listings…</div>
          ) : (
            <ListingBrowse
              title={title}
              subtitle="Browse, search, and filter items in this category."
              items={items}
            />
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default CategoryListings
