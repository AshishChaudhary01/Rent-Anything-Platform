import { useNavigate, useSearchParams } from "react-router-dom"
import { IoCalendarOutline, IoCubeOutline, IoLocationOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoTimeOutline } from "react-icons/io5"
import ChatLink from "../../core/chat/ChatLink"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { OWNER_RETURN_STEPS } from "../returnSteps"
import { useRental } from "../../../../hooks/queries/useRentals"

function OwnerReturnReview() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)
  const when = rental?.returnMeetupAt ? new Date(rental.returnMeetupAt) : null

  if (!rentalId) return <p className="px-6 py-10 text-muted">Choose a rental first.</p>
  if (isPending || !rental) return <p className="px-6 py-10 text-muted">Loading rental…</p>

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={1} title="End Rental" steps={OWNER_RETURN_STEPS} />

          <div>
            <div className="text-xl font-bold">Review Return</div>
            <div className="text-sm md:text-base font-light text-muted">
              Optional check before pickup. Skip if you already agree the item looks fine.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCubeOutline className="size-5 text-primary" />
              Listing
            </div>
            <div className="flex gap-x-4">
              <img src={rental.listingImage} alt="" className="size-16 rounded-lg object-cover" />
              <div>
                <div className="font-semibold">{rental.listingTitle}</div>
                <div className="text-sm text-muted">Nrs. {Number(rental.dailyRate).toLocaleString()} / day</div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoPersonOutline className="size-5 text-primary" />
              Renter
            </div>
            <div className="flex items-center gap-x-3">
              {rental.renterAvatarUrl ? <img src={rental.renterAvatarUrl} alt="" className="size-10 rounded-full object-cover" /> : <div className="size-10 rounded-full bg-surface" />}
              <div className="flex-1">
                <div className="font-semibold">{rental.renterName}</div>
                <div className="text-sm text-muted">Active renter</div>
              </div>
              <ChatLink rentalId={rental.id} size="sm" widthFill={false} />
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Date</div>
              <div className="font-medium">{when ? when.toLocaleDateString() : "—"}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoTimeOutline className="size-4 text-primary" /> Time</div>
              <div className="font-medium">{when ? when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium">{rental.returnMeetupLocation || rental.meetupLocation}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <IoShieldCheckmarkOutline className="size-5 text-primary" />
              Safety Checklist
            </div>
            <ul className="list-disc pl-5 text-sm font-light text-muted space-y-1">
              <li>Item condition matches what you expect.</li>
              <li>Scan QR only after both of you agree the return is complete.</li>
            </ul>
          </RaCard>

          <OwnerReturnNav
            onPrev={() => navigate(`/user/rent/return-schedule?rentalId=${rental.id}`)}
            onNext={() => navigate(`/user/rent/return-meetup?rentalId=${rental.id}`)}
            nextText="Skip to meetup"
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default OwnerReturnReview
