import { Link, useParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import {
  IoCashOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoClose,
  IoLocationOutline,
  IoStar,
  IoTimeOutline,
} from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import Divider from "../../../../components/divider/Divider"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import ReturnFlowHeader from "../../rent/ReturnFlowHeader"
import ChatLink from "../chat/ChatLink"
import ReportLink from "../../../../components/report/ReportLink"
import { raToast } from "../../../../lib/raToast"
import { useAcceptRental, useDeclineRental, useRental } from "../../../../hooks/queries/useRentals"
import type { Rental } from "../../../../types/rental.types"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"
import {
  OWNER_RENT_STEPS,
  ownerNextAction,
  ownerProgressHint,
  ownerRentStep,
  requestCardLabel,
} from "./ownerRequestProgress"

function Actions({ rental }: { rental: Rental }) {
  const accept = useAcceptRental()
  const decline = useDeclineRental()
  const next = ownerNextAction(rental)
  return (
    <div className="flex flex-col gap-2">
      {next && (
        <Link to={next.to}>
          <RaButton type="button" btnText={next.label} />
        </Link>
      )}
      {rental.status === "REQUESTED" && (
        <div className="flex gap-2">
          <RaButton
            type="button"
            btnText="Accept"
            variant="success"
            icon={<IoCheckmarkOutline />}
            iconPosition="left"
            clickFunc={() =>
              accept.mutate(rental.id, {
                onSuccess: () => raToast.success("Request accepted. The renter can pay now."),
                onError: (error) => raToast.fromError(error, "Could not accept"),
              })
            }
          />
          <RaButton
            type="button"
            btnText="Decline"
            variant="danger"
            icon={<IoClose />}
            iconPosition="left"
            clickFunc={() =>
              decline.mutate(rental.id, {
                onSuccess: () => raToast.warning("Request declined"),
                onError: (error) => raToast.fromError(error, "Could not decline"),
              })
            }
          />
        </div>
      )}
      {rental.status === "PENDING_PAYMENT" && (
        <div className="text-sm text-muted">No action needed until the renter pays the commitment fee.</div>
      )}
      {rental.status === "MEETUP_CONFIRMED" && (
        <div className="text-sm text-muted">Pickup QR matched. Waiting for the renter to pay remaining rent.</div>
      )}
      <ChatLink rentalId={rental.id} btnText={`Chat with ${rental.renterName}`} variant="outline" />
      <ReportLink
        draft={{
          context: "request",
          listingTitle: rental.listingTitle,
          listingId: rental.listingId,
          accusedName: rental.renterName,
          accusedId: rental.renterId,
          rentalId: rental.id,
        }}
        btnText="Report this renter"
        variant="lean"
        widthFill
      />
    </div>
  )
}

function RequestDetails() {
  const { id = "" } = useParams()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { data: rental, isPending, isError } = useRental(id)

  if (isPending) {
    return <RaPageLoader label="Loading request…" />
  }
  if (isError || !rental) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <div className="text-muted py-8 text-center">This request could not be found.</div>
        </RaContainerPadding>
      </RaContainer>
    )
  }

  const panel = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {rental.renterAvatarUrl ? (
          <img src={rental.renterAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
        ) : (
          <div className="size-10 rounded-full bg-surface" />
        )}
        <div>
          <div className="font-semibold">
            <Link to={`/user/people/${rental.renterId}`} className="hover:text-primary">{rental.renterName}</Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <IoStar className="size-3 text-yellow-400" />
            {rental.renterRating ? Number(rental.renterRating).toFixed(1) : "New"}
            <span>({rental.renterReviewCount || 0})</span>
          </div>
        </div>
      </div>
      {!isMobile && <Actions rental={rental} />}
      <div className="flex gap-x-2 text-sm">
        <IoLocationOutline className="size-4 text-primary shrink-0 mt-0.5" />
        <span>{rental.renterCity || rental.meetupLocation}</span>
      </div>
      <div className="flex items-start gap-1.5 text-sm">
        <IoCheckmarkCircleOutline className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <div className="text-muted">Completed rentals</div>
          <div className="font-semibold">{rental.renterCompletedRentals || 0}</div>
        </div>
      </div>
      {isMobile && <Actions rental={rental} />}
    </div>
  )

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6 pb-28 lg:pb-10">
          <div className="col-span-full lg:col-span-6 flex flex-col gap-y-4">
            <RaBreadcrumb items={[
              { label: "My Listings", path: "/user/my-listings" },
              { label: "My Requests", path: "/user/listing-requests" },
              { label: "Request progress" },
            ]} />
            <ReturnFlowHeader
              current={ownerRentStep(rental.status)}
              title="Rental progress"
              steps={OWNER_RENT_STEPS}
            />
            <p className="text-sm md:text-base font-light text-muted -mt-2">{ownerProgressHint(rental)}</p>
            <RaCard round="round" styleClass="p-0! overflow-hidden flex flex-col sm:flex-row">
              <img src={rental.listingImage} alt="" className="w-full sm:w-60 aspect-square object-cover" />
              <div className="flex-1 min-w-0 p-4 md:p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xl md:text-2xl font-bold">{rental.listingTitle}</div>
                  <RaBadge badgeText={requestCardLabel(rental.status)} size="sm" />
                </div>
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-xs text-muted">PICK UP</div>
                    <div className="font-bold">{rental.startDate}</div>
                  </div>
                  <div className="text-xs font-bold text-primary flex flex-col items-center">
                    <IoTimeOutline className="size-4" />
                    {rental.days} DAYS
                  </div>
                  <div>
                    <div className="text-xs text-muted">RETURN</div>
                    <div className="font-bold">{rental.endDate}</div>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between text-muted">
                  <span className="flex items-center gap-1"><IoCashOutline className="size-4 text-primary" /> Rate</span>
                  <span className="font-semibold text-inherit">Nrs. {Number(rental.dailyRate).toLocaleString()} / day</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">Nrs. {Number(rental.rentalTotal).toLocaleString()}</span>
                </div>
                <Divider />
                <div>
                  <div className="flex items-center gap-1.5 text-sm text-muted mb-1">
                    <IoChatbubbleOutline className="size-4 text-primary" />
                    Message from requester
                  </div>
                  <p className="font-light">{rental.renterNote || "No note was added."}</p>
                </div>
              </div>
            </RaCard>
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <RaCard round="round" bg="accent" styleClass="flex flex-col gap-4">{panel}</RaCard>
          </aside>
          {isMobile && (
            <RaBottomSheet>
              {panel}
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RequestDetails
