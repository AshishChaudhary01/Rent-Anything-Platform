import { Link } from "react-router-dom"
import { IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaButton from "../../../../components/button/RaButton"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import RaMapView from "../../../../components/maps/RaMapView"

const meetup = { lat: 28.2096, lng: 83.9556, label: "Lakeside, Sector 6, Pokhara" }

function RentalDetailsSummary() {
  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <RaCard styleClass="flex flex-col gap-y-4">
        <div className="font-bold text-lg">Rental Summary</div>

        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-xs text-muted">PICK UP</div>
            <div className="font-bold">Oct 24</div>
            <div className="text-sm text-muted">Thursday</div>
          </div>
          <div className="text-xs font-bold text-primary">3 DAYS</div>
          <div>
            <div className="text-xs text-muted">RETURN</div>
            <div className="font-bold">Oct 27</div>
            <div className="text-sm text-muted">Sunday</div>
          </div>
        </div>

        <Divider />

        <div className="flex justify-between text-muted">
          <span>Duration</span>
          <span className="font-semibold text-inherit">3 Days</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Cost per Day</span>
          <span className="font-semibold text-inherit">NPR 4,000</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Rental Subtotal</span>
          <span className="font-semibold text-inherit">NPR 12,000</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Service Fee</span>
          <span className="font-semibold text-inherit">NPR 2,500</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span className="text-primary">NPR 14,500</span>
        </div>

        <Divider />

        <div className="flex gap-x-2">
          <IoLocationOutline className="size-5 text-primary shrink-0" />
          <div>
            <div className="font-semibold">Meetup Location</div>
            <div className="text-sm text-muted">Lakeside, Sector 6, Pokhara</div>
            <a href="#meetup-map" className="text-sm text-primary">View on Map</a>
          </div>
        </div>

        <Link to="/user/rent/return-schedule">
          <RaButton type="button" btnText="Return Item" size="large" />
        </Link>

        <div className="flex gap-x-2 text-sm text-muted">
          <IoShieldCheckmarkOutline className="size-4 text-primary shrink-0 mt-0.5" />
          SafeReturn protection active. We'll verify the condition upon return.
        </div>
      </RaCard>

      <div id="meetup-map">
        <RaMapView center={meetup} />
      </div>
    </div>
  )
}

export default RentalDetailsSummary
