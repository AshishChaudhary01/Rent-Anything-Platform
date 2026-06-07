import RaBottomSheet from "../../../components/bottomSheet/RaBottomSheet";
import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import ListingMain from "./main/ListingMain";
import SummaryCard from "./summaryCard/SummaryCard";
import { useMediaQuery } from "react-responsive";

function Listing() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            {/* Main Content */}
            <ListingMain />
          </div>
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <SummaryCard />
          </aside>
          {/* Mobile Bottom Sheet ONLY */}
          {isMobile && (
            <RaBottomSheet >
              <SummaryCard />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  );
}

export default Listing