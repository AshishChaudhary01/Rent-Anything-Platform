import { Link, useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoChatbubbleOutline, IoCubeOutline, IoImagesOutline, IoLocationOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { OWNER_RETURN_STEPS } from "../returnSteps"
import { backpack01, profile01, tent01, tools01 } from "../../../../utils/images"

const proofMedia = [tools01, tent01, backpack01]

function OwnerReturnReview() {
  const navigate = useNavigate()

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={1} title="End Rental" steps={OWNER_RETURN_STEPS} />

          <div>
            <div className="text-xl font-bold">Review Return</div>
            <div className="text-sm md:text-base font-light text-muted">
              Check item, renter, and meetup details before pickup.
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
                <div className="text-sm text-muted">Active renter</div>
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

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoImagesOutline className="size-5 text-primary" />
              Condition Summary
            </div>
            <div className="text-sm text-muted">Pre-return photos uploaded.</div>
            <div className="grid grid-cols-3 gap-2">
              {proofMedia.map((src) => (
                <img key={src} src={src} alt="Condition" className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <IoShieldCheckmarkOutline className="size-5 text-primary" />
              Safety Checklist
            </div>
            <ul className="list-disc pl-5 text-sm font-light text-muted space-y-1">
              <li>Item condition matches uploaded proof.</li>
              <li>Scan only after both of you agree the return is complete.</li>
            </ul>
          </RaCard>

          <OwnerReturnNav
            onPrev={() => navigate("/user/rent/return-schedule?role=owner")}
            onNext={() => navigate("/user/rent/owner-return-pickup")}
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default OwnerReturnReview
