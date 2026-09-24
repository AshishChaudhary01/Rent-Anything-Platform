import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  IoArrowForwardOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoCubeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoQrCodeOutline,
} from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import RentFlowLeave from "../RentFlowLeave"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { useRental } from "../../../../hooks/queries/useRentals"

function Confirmation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)

  useEffect(() => {
    if (!rentalId) navigate("/user", { replace: true })
  }, [rentalId, navigate])

  useEffect(() => {
    if (!rental) return
    if (rental.status === "REQUESTED") {
      navigate(`/user/rent/waiting?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "PENDING_PAYMENT" || rental.status === "CANCELLED") {
      navigate(`/user/rent/checkout?rentalId=${rental.id}`, { replace: true })
    }
  }, [rental, navigate])

  if (isPending || !rental) {
    return <p className="px-6 py-10 text-muted">Loading confirmation…</p>
  }

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={2} title="Rent Item" steps={RENT_STEPS} />

          <div className="text-center space-y-2">
            <IoCheckmarkCircle className="size-14 mx-auto text-success" />
            <div className="text-xl font-bold">Booking Confirmed</div>
            <div className="text-sm md:text-base font-light text-muted">
              Payment received. You can leave now and come back from My rentals, or go to meetup when you meet the owner.
            </div>
          </div>

          <RentHint icon={<IoQrCodeOutline className="size-6" />} title="Next: scan at pickup" tone="success">
            The rental starts only after one of you scans the other person’s QR. You do not need to stay on this page.
          </RentHint>

          <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCubeOutline className="size-5 text-primary" />
              Listing
            </div>
            <div className="flex gap-x-4">
              {rental.listingImage ? (
                <img src={rental.listingImage} alt="" className="size-16 rounded-lg object-cover" />
              ) : (
                <div className="size-16 rounded-lg bg-white" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{rental.listingTitle}</div>
                  <RaBadge badgeText="Paid" size="sm" />
                </div>
                <div className="text-sm text-muted">Nrs. {Number(rental.commitmentFee)} held as commitment</div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" bg="info" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-info" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-info" /> Dates</div>
              <div className="font-medium">{rental.startDate} – {rental.endDate}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-info" /> Location</div>
              <div className="font-medium text-right max-w-[60%]">{rental.meetupLocation}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoPersonOutline className="size-5 text-primary" />
              Owner
            </div>
            <div className="flex items-center gap-x-3">
              {rental.ownerAvatarUrl ? (
                <img src={rental.ownerAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
              ) : (
                <div className="size-10 rounded-full bg-surface" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{rental.ownerName}</div>
                <div className="text-sm text-muted">Coordinate pickup</div>
              </div>
              <ChatLink rentalId={rental.id} size="sm" widthFill={false} />
            </div>
          </RaCard>

          <RentHint icon={<IoShieldCheckmarkOutline className="size-6" />} title="Fee is held, not paid out" tone="warning">
            {rental.escrowNote || "RAP holds the commitment fee until the rental is completed."}
            {" "}Daily rent and deposit are due at pickup. If the owner cancels before pickup, you get a refund. If you cancel within a day of start, the fee may be kept.
          </RentHint>

          <RaButton
            type="button"
            btnText="Go to meetup / scan QR"
            variant="primary"
            icon={<IoArrowForwardOutline />}
            clickFunc={() => navigate(`/user/rent/meetup?rentalId=${rental.id}`)}
          />
          <RentFlowLeave owner={rental.owner} listingId={rental.listingId} rentalId={rental.id} />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Confirmation
