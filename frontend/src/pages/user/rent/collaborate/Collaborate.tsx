import { useMediaQuery } from "react-responsive";
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet";
import RaContainer from "../../../../components/container/RaContainer";
import RaContainerPadding from "../../../../components/container/RaContainerPadding";
import CollaborateChat from "./CollaborateChat";
import CollaborateSummaryCard from "./CollaborateSummaryCard";


function Collaborate() {
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  return (
    <RaContainer>
      <RaContainerPadding>

        <div className="grid grid-cols-9 gap-6">

          {/* Chat */}
          <div className="col-span-full lg:col-span-6">
            <CollaborateChat />
          </div>

          {/* Desktop Summary */}
          <aside className="hidden lg:block lg:col-span-3">
            <CollaborateSummaryCard />
          </aside>

          {/* Mobile Summary */}
          {isMobile && (
            <RaBottomSheet>
              <CollaborateSummaryCard />
            </RaBottomSheet>
          )}

        </div>

      </RaContainerPadding>
    </RaContainer>
  );
}

export default Collaborate;