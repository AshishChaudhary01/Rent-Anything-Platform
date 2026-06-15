import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import CheckoutMain from "./CheckoutMain"
import CheckoutSummaryCard from "./CheckoutSummaryCard"
import RaContainerLG from "../../../../components/container/RaContainerLG"

function Checkout() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            {/* Main Content */}
            <CheckoutMain />
          </div>
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <CheckoutSummaryCard />
          </aside>
          {/* Mobile Bottom Sheet ONLY */}
          {isMobile && (
            <RaBottomSheet>
              <CheckoutSummaryCard />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Checkout