import { Link } from "react-router-dom"
import { IoCalendarOutline, IoChatbubbleOutline, IoCheckmarkCircle, IoLocationOutline, IoShieldCheckmarkOutline, IoStar, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import RaButton from "../../../../components/button/RaButton"
import Divider from "../../../../components/divider/Divider"
import { profile01, tools01 } from "../../../../utils/images"

function Confirmation() {
  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6">
          <div className="text-center space-y-2">
            <IoCheckmarkCircle className="size-14 mx-auto text-primary" />
            <div className="text-xl md:text-2xl font-bold">Booking Confirmed</div>
            <div className="text-sm md:text-base font-light text-muted">Your rental is locked in. Get ready for pickup.</div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <img src={tools01} alt="Listing" className="size-20 md:size-24 rounded-lg object-cover" />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-base md:text-lg">Sony A7R IV</div>
                  <RaBadge badgeText="Confirmed" size="sm" />
                </div>
                <p className="text-sm font-light text-muted">Mirrorless camera with 61.0MP full-frame sensor.</p>
                <div className="flex items-center gap-x-1 text-sm text-muted">
                  <IoShieldCheckmarkOutline className="size-4 text-primary" />
                  Insured Item
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex justify-between items-center">
              <div className="font-semibold">Booking Summary</div>
              <div className="text-sm text-muted">#RA-8821</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between gap-x-4">
                <div className="flex gap-x-2">
                  <IoCalendarOutline className="size-4 text-primary" />
                  <div className="text-muted text-sm md:text-base font-light">Rental Dates</div>
                </div>
                <div className="font-medium text-muted">Oct 24 - Oct 27</div>
              </div>
              <div className="flex justify-between gap-x-4">
                <div className="flex gap-x-2">
                  <IoTimeOutline className="size-4 text-primary" />
                  <div className="text-muted text-sm md:text-base font-light">Pickup Time</div>
                </div>
                <div className="font-medium text-muted">10:30 AM</div>
              </div>
              <div className="flex justify-between gap-x-4">
                <div className="flex gap-x-2">
                  <IoTimeOutline className="size-4 text-primary" />
                  <div className="text-muted text-sm md:text-base font-light">Duration</div>
                </div>
                <div className="font-medium text-muted">3 Days</div>
              </div>
              <div className="flex justify-between gap-x-4">
                <div className="text-muted text-sm md:text-base font-light">Amount Paid</div>
                <div className="font-bold text-primary">Nrs. 38,950</div>
              </div>
              <div className="flex justify-between gap-x-4">
                <div className="flex gap-x-2">
                  <IoLocationOutline className="size-4 text-primary" />
                  <div className="text-muted text-sm md:text-base font-light">Meetup</div>
                </div>
                <div className="font-medium text-muted text-right">Lazimpat, Kathmandu</div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <div className="font-semibold">Next Step Instructions</div>
            <ol className="list-decimal pl-5 space-y-2 text-sm md:text-base font-light text-muted">
              <li>Meet at the selected location on scheduled time.</li>
              <li>Use QR code at meetup to start rental. Owner must be present during the scan.</li>
            </ol>
            <div className="text-center space-y-2">
              <div className="font-semibold">Scan at meetup to activate</div>
              <div className="text-sm font-light text-muted">Required from both parties</div>
              <div className="size-40 mx-auto border border-gray-300 rounded-lg bg-surface flex items-center justify-center text-muted text-sm">QR</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <div className="font-semibold">Equipment Owner</div>
            <div className="flex items-center gap-x-4">
              <img src={profile01} alt="Owner" className="size-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold">Anish Sharma</div>
                <div className="flex items-center gap-x-1 text-sm text-muted">
                  <IoStar className="size-4 text-yellow-400" />
                  4.9 (128 Reviews)
                </div>
              </div>
              <Link to="/user/chat">
                <RaButton type="button" btnText="Chat" size="sm" variant="outline" widthFill={false} icon={<IoChatbubbleOutline />} />
              </Link>
            </div>
            <div className="text-sm font-light text-muted">Use for last-minute coordination only.</div>
          </RaCard>

          <Link to="/user/my-rentals">
            <RaButton type="button" btnText="View My Rentals" />
          </Link>
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Confirmation
