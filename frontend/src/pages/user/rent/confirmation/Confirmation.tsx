import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoCheckmarkCircle, IoCubeOutline, IoLocationOutline, IoPersonOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { chatWithOwner } from "../../core/chat/chatData"
import { profile01, tools01 } from "../../../../utils/images"

function Confirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const paid = Boolean((location.state as { paid?: boolean } | null)?.paid)

  useEffect(() => {
    if (!paid) navigate("/user/rent/checkout", { replace: true })
  }, [paid, navigate])

  if (!paid) return null

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={2} title="Rent Item" steps={RENT_STEPS} />

          <div className="text-center space-y-2">
            <IoCheckmarkCircle className="size-14 mx-auto text-primary" />
            <div className="text-xl font-bold">Booking Confirmed</div>
            <div className="text-sm md:text-base font-light text-muted">
              Payment received. Meet the owner to start the rental.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCubeOutline className="size-5 text-primary" />
              Listing
            </div>
            <div className="flex gap-x-4">
              <img src={tools01} alt="Item" className="size-16 rounded-lg object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">Sony A7R IV Professional Kit</div>
                  <RaBadge badgeText="Paid" size="sm" />
                </div>
                <div className="text-sm text-muted">Nrs. 100 paid now</div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Date</div>
              <div className="font-medium">Oct 24, 2023</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoTimeOutline className="size-4 text-primary" /> Time</div>
              <div className="font-medium">10:30 AM</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium">Lazimpat, Kathmandu</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoPersonOutline className="size-5 text-primary" />
              Owner
            </div>
            <div className="flex items-center gap-x-3">
              <img src={profile01} alt="Owner" className="size-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold">Anish Sharma</div>
                <div className="text-sm text-muted">Coordinate pickup</div>
              </div>
              <ChatLink context={chatWithOwner} size="sm" widthFill={false} />
            </div>
          </RaCard>

          <OwnerReturnNav
            onPrev={() => navigate("/user/rent/checkout")}
            onNext={() => navigate("/user/rent/meetup", { state: { paid: true } })}
            nextText="Continue"
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Confirmation
