import { useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"

function ReturnMeetup() {
  const navigate = useNavigate()

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={2} />

          <div>
            <div className="text-xl font-bold">Return Verification</div>
            <div className="text-sm md:text-base font-light text-muted">
              Show this QR to the owner after they check the item.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col items-center gap-y-3 text-center">
            <div className="font-semibold text-lg">Scan to complete return</div>
            <div className="size-52 border border-gray-300 rounded-2xl bg-surface flex items-center justify-center text-muted">QR</div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="font-semibold">Meetup Details</div>
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

          <RaCard round="round" styleClass="flex flex-col gap-y-2">
            <div className="font-semibold">Before you scan</div>
            <ul className="list-disc pl-5 text-sm font-light text-muted space-y-1">
              <li>Item condition matches uploaded proof.</li>
              <li>Both of you agree the return is complete.</li>
            </ul>
          </RaCard>

          <RaButton type="button" btnText="Confirm Return" clickFunc={() => navigate("/user/my-rentals")} />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReturnMeetup
