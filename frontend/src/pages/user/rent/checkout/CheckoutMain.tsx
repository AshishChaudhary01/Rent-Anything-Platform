import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import { esewa, khalti, tent01 } from "../../../../utils/images"
import Divider from "../../../../components/divider/Divider"

function CheckoutMain() {
  return (
    <div className="flex flex-col gap-y-4">

      {/* Listing Info */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-0">
          <div className="text-xl md:text-2xl font-bold">Checkout</div>
          <div className="text-sm md:text-base font-light">Don't worry, you only have to pay a small commitment fee for now.</div>
        </div>
        <div className="space-y-6 w-full max-w-xl mx-auto">
          {/* Booking details */}
          <RaCard round="round" styleClass="grid grid-cols-9 gap-x-6 p-4!">
            <img src={tent01} alt="Listing Image" className="col-start-3 col-span-5 md:col-span-3 max-w-full aspect-square bg-cover bg-no-repeat rounded-lg mb-4" />
            <div className="col-span-full md:col-span-6 flex flex-col gap-y-3">
              <div className="font-semibold text-base md:text-lg">Camping Tent</div>
              <Divider />
              <div className="space-y-2">
                <div className="text-muted font-semibold">Rental Details:</div>
                <div className="flex justify-between gap-x-4">
                  <div className="flex gap-x-2">
                    <IoCalendarOutline className="size-4 text-primary" />
                    <div className="text-muted text-sm md:text-base font-light">From-To:</div>
                  </div>
                  <div className="font-medium text-muted">Oct 24 - 27</div>
                </div>
                <div className="flex justify-between gap-x-4">
                  <div className="flex gap-x-2">
                    <IoTimeOutline className="size-4 text-primary" />
                    <div className="text-muted text-sm md:text-base font-light">Duration:</div>
                  </div>
                  <div className="font-medium text-muted">4 Days</div>
                </div>
              </div>
              <Divider />
              <div className="space-y-2">
                <div className="text-muted font-semibold">Meetup Details:</div>
                <div className="flex justify-between gap-x-4">
                  <div className="flex gap-x-2">
                    <IoLocationOutline className="size-4 text-primary" />
                    <div className="text-muted text-sm md:text-base font-light">Pickup at:</div>
                  </div>
                  <div className="font-medium text-muted">Lazimpat, Kathmandu</div>
                </div>
                <div className="flex justify-between gap-x-4">
                  <div className="flex gap-x-2">
                    <IoCalendarOutline className="size-4 text-primary" />
                    <div className="text-muted text-sm md:text-base font-light">Pickup Date:</div>
                  </div>
                  <div className="font-medium text-muted">Oct 24</div>
                </div>
                <div className="flex justify-between gap-x-4">
                  <div className="flex gap-x-2">
                    <IoTimeOutline className="size-4 text-primary" />
                    <div className="text-muted text-sm md:text-base font-light">Pickup Time:</div>
                  </div>
                  <div className="font-medium text-muted">10:00 AM</div>
                </div>
              </div>
            </div>
          </RaCard>

          {/* Payment Method */}
          <div className="space-y-4">
            <div className="text-xl font-semibold">Payment Method</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold">
              <RaCard bg="surface" round="round" styleClass="flex gap-x-6 p-4!">
                <img src={esewa} alt="Esewa Logo" className="size-8 md:size-10 bg-cover bg-no-repeat rounded-full" />
                <div className="self-center">Esewa</div>
              </RaCard>
              <RaCard bg="surface" round="round" styleClass="flex gap-x-6 p-4!">
                <img src={khalti} alt="Khalti Logo" className="size-8 md:size-10 bg-cover bg-no-repeat rounded-full" />
                <div className="self-center">Khalti</div>
              </RaCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutMain