import { useMediaQuery } from "react-responsive";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import RaContainer from "../../../../components/container/RaContainer";
import RaContainerPadding from "../../../../components/container/RaContainerPadding";
import RequestToRentForm, { type RequestToRentFormValue } from "./form/RequestToRentForm";
import RequestToRentSummaryCard from "./summaryCard/RequestToRentSummaryCard";
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet";
import { useListing } from "../../../../hooks/queries/useListings";
import { useCreateRental } from "../../../../hooks/queries/useRentals";
import { raToast } from "../../../../lib/raToast";
import RaButton from "../../../../components/button/RaButton";
import ReturnFlowHeader from "../ReturnFlowHeader";
import { RENT_STEPS } from "../returnSteps";
import { IoArrowBackOutline } from "react-icons/io5";

function RequestToRent() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const listingId = params.get("listing") || "";
  const { data: listing, isPending, isError } = useListing(listingId);
  const createRental = useCreateRental();

  const [formData, setFormData] = useState<RequestToRentFormValue>({
    startDate: "",
    endDate: "",
    meetupLocation: "",
  });

  const continueToCheckout = () => {
    if (!listing) return;
    if (listing.owner) {
      raToast.error("You cannot rent your own listing");
      return;
    }
    if (listing.status !== "AVAILABLE" && listing.status !== "RENTED") {
      raToast.error("This listing is not available to rent");
      return;
    }
    createRental.mutate(
      {
        listingId: listing.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        meetupLocation: formData.meetupLocation,
        meetupLatitude: formData.meetupLatitude,
        meetupLongitude: formData.meetupLongitude,
        note: formData.note,
      },
      {
        onSuccess: (rental) => {
          raToast.success("Request sent. Stay here until the owner accepts.")
          navigate(`/user/rent/waiting?rentalId=${rental.id}`)
        },
        onError: (error) => raToast.fromError(error, "Could not create rental request"),
      },
    );
  };

  if (!listingId) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <p className="text-muted">Choose a listing first, then request to rent it.</p>
        </RaContainerPadding>
      </RaContainer>
    );
  }

  if (isPending) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <p className="text-muted">Loading listing…</p>
        </RaContainerPadding>
      </RaContainer>
    );
  }

  if (isError || !listing) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <p className="text-muted">Listing not found.</p>
        </RaContainerPadding>
      </RaContainer>
    );
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-full mb-2">
            <ReturnFlowHeader current={0} title="Rent Item" steps={RENT_STEPS} />
          </div>
          <div className="col-span-full lg:col-span-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="text-xl md:text-2xl font-bold">Request dates and meetup</div>
              <div className="sm:w-auto w-fit">
                <RaButton
                  type="button"
                  btnText="Back to listing"
                  variant="ghost"
                  size="sm"
                  widthFill={false}
                  icon={<IoArrowBackOutline />}
                  iconPosition="left"
                  clickFunc={() => navigate(`/user/listing/${listing.id}`)}
                />
              </div>
            </div>
            <RequestToRentForm
              value={formData}
              onChange={setFormData} />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <RequestToRentSummaryCard
              listing={listing}
              formData={formData}
              onContinue={continueToCheckout}
              loading={createRental.isPending} />
          </aside>
          {isMobile && (
            <RaBottomSheet >
              <RequestToRentSummaryCard
                listing={listing}
                formData={formData}
                onContinue={continueToCheckout}
                loading={createRental.isPending} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  );
}

export default RequestToRent;
