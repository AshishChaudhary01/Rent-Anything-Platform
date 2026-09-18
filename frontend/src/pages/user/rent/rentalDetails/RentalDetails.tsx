import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RentalDetailsMain from "./RentalDetailsMain"
import RentalDetailsSummary from "./RentalDetailsSummary"

function RentalDetails() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            <RentalDetailsMain />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <RentalDetailsSummary />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <RentalDetailsSummary />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RentalDetails
