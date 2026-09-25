import { useSearchParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import ListingBrowse from "../../../../components/listingBrowse/ListingBrowse"
import { useListings } from "../../../../hooks/queries/useListings"
import { toListingCard } from "../../../../types/listing.types"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get("q") || ""
  const { data, isPending } = useListings({ q, size: 50, sort: "newest" })
  const items = (data?.items ?? []).map(toListingCard)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-4">
          <RaBreadcrumb items={[{ label: "Search" }]} />
          {isPending ? (
            <RaPageLoader label="Searching listings…" />
          ) : (
            <ListingBrowse
              title={q ? `Results for “${q}”` : "Search"}
              subtitle="Sort and filter matching listings."
              items={items}
              showCategoryFilter
              initialQuery={q}
            />
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default SearchResults
