import { useMediaQuery } from "react-responsive";
import RaContainer from "../../../../components/container/RaContainer";
import RaContainerPadding from "../../../../components/container/RaContainerPadding";
import RequestToRentForm from "./form/RequestToRentForm";
import RequestToRentSummaryCard from "./summaryCard/RequestToRentSummaryCard";
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet";
import { useState } from "react";

function RequestToRent() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    meetupLocation: "",
    note: "",
  });

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full lg:col-span-6">
            {/* Main Content */}
            <div className="text-xl md:text-4xl font-bold mb-6">Request to Rent</div>
            <RequestToRentForm
              value={formData}
              onChange={setFormData} />
          </div>
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <RequestToRentSummaryCard
              formData={formData} />
          </aside>
          {/* Mobile Bottom Sheet ONLY */}
          {isMobile && (
            <RaBottomSheet >
              <RequestToRentSummaryCard
                formData={formData} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>

    // <div>
    //   <RequestToRentForm />

    //   <
    //   {/* <RaContainerMD>
    //     <RaLocationPicker
    //       value={location}
    //       onChange={setLocation}
    //     />
    //   </RaContainerMD> */}
    // </div>
  );
}

export default RequestToRent;