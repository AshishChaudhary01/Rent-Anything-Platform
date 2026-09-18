import { useSearchParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import ListingBrowse from "../../../../components/listingBrowse/ListingBrowse"
import { catalog } from "../../../../data/catalog"

function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get("q") || ""

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-4">
          <RaBreadcrumb items={[{ label: "Search" }]} />
          <ListingBrowse
            title={q ? `Results for “${q}”` : "Search"}
            subtitle="Sort and filter matching listings."
            items={catalog}
            showCategoryFilter
            initialQuery={q}
          />
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default SearchResults
