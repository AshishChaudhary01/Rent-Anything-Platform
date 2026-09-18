import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoChatbubbleOutline, IoCheckmarkCircle, IoCubeOutline, IoLocationOutline, IoPersonOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import { OWNER_RETURN_STEPS } from "../returnSteps"
import { profile01, tools01 } from "../../../../utils/images"

function OwnerReturnConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const scanned = Boolean((location.state as { scanned?: boolean } | null)?.scanned)

  useEffect(() => {
    if (!scanned) navigate("/user/rent/owner-return-pickup", { replace: true })
  }, [scanned, navigate])

  if (!scanned) return null

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={3} title="End Rental" steps={OWNER_RETURN_STEPS} />

          <div className="text-center space-y-2">
            <IoCheckmarkCircle className="size-14 mx-auto text-primary" />
            <div className="text-xl font-bold">Return Confirmed</div>
            <div className="text-sm md:text-base font-light text-muted">
              QR scanned. This rental is complete.
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
                <div className="font-semibold">Sony A7R IV Professional Kit</div>
                <div className="text-sm text-muted">Nrs. 999 / day</div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoPersonOutline className="size-5 text-primary" />
              Renter
            </div>
            <div className="flex items-center gap-x-3">
              <img src={profile01} alt="Renter" className="size-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold">Anish Sharma</div>
                <div className="text-sm text-muted">Return complete</div>
              </div>
              <Link to="/user/chat">
                <RaButton type="button" btnText="Chat" size="sm" variant="outline" widthFill={false} icon={<IoChatbubbleOutline />} iconPosition="left" />
              </Link>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Date</div>
              <div className="font-medium">Oct 27, 2023</div>
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

          <RaButton
            type="button"
            btnText="Done"
            icon={<IoCheckmarkCircle />}
            iconPosition="left"
            clickFunc={() => navigate("/user/my-listings")}
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default OwnerReturnConfirm
