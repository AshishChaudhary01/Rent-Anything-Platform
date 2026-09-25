import { useParams } from "react-router-dom"
import RaBottomSheet from "../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../components/container/RaContainer"
import RaContainerPadding from "../../../components/container/RaContainerPadding"
import ListingMain from "./main/ListingMain"
import SummaryCard from "./summaryCard/SummaryCard"
import { useMediaQuery } from "react-responsive"
import { useListing } from "../../../hooks/queries/useListings"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function Listing() {
  const { id } = useParams()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { data: listing, isPending, isError } = useListing(id)

  if (isPending) {
    return <RaPageLoader label="Loading listing…" />
  }
  if (isError || !listing) {
    return <div className="px-6 py-10 text-muted">This listing is not available.</div>
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            <ListingMain listing={listing} />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <SummaryCard listing={listing} />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <SummaryCard listing={listing} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Listing
