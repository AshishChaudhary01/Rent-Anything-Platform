import { useSearchParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RentalDetailsMain from "./RentalDetailsMain"
import RentalDetailsSummary from "./RentalDetailsSummary"
import { useRental } from "../../../../hooks/queries/useRentals"
import { useListing } from "../../../../hooks/queries/useListings"

function RentalDetails() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending, isError } = useRental(rentalId)
  const { data: listing } = useListing(rental?.listingId)

  if (!rentalId) {
    return <p className="px-6 py-10 text-muted">Choose a rental from My rentals or your listing.</p>
  }
  if (isPending) {
    return <p className="px-6 py-10 text-muted">Loading rental…</p>
  }
  if (isError || !rental) {
    return <p className="px-6 py-10 text-muted">This rental is not available.</p>
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            <RentalDetailsMain rental={rental} listing={listing} />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <RentalDetailsSummary rental={rental} />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <RentalDetailsSummary rental={rental} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RentalDetails
