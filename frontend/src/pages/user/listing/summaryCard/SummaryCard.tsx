import { IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import RaButton from "../../../../components/button/RaButton"
import RaInput from "../../../../components/input/RaInput"
import RequestToRentButton from "./RequestToRentButton"

function SummaryCard() {
  return (
    <RaCard styleClass="flex flex-col gap-y-4">
      <div className="font-medium flex justify-between lg:justify-start items-end">
        <div className="flex justify-between lg:justify-start gap-x-2">
          <p className="text-primary text-lg md:text-3xl font-bold">
            Nrs. 999
          </p>
          <p className="flex items-end">/ day</p>
        </div>

        {/* Request Button for Small Screen ONLY */}
        <div className="lg:hidden flex justify-end">
          <RequestToRentButton/>
        </div>
      </div>
      {/* <div className="font-medium flex justify-between items-end text-base md:text-lg">
        <p>Rate:</p>
        <p><span className="text-primary text-lg md:text-3xl font-bold">Nrs. 999</span> / day</p>
      </div> */}
      <Divider />

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoLocationOutline className="size-4" />
            <p>Location</p>
          </div>
          <p className="font-bold">Lazimpat, Kathmandu</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoShieldCheckmarkOutline className="size-4" />
            <p>Security Deposit</p>
          </div>
          <p className="font-bold">10,000</p>
        </div>
        <p className="font-light text-sm text-muted">* Refundable upon safe return</p>
      </div>
      <Divider />

      {/* Request To Rent Button Full view Only */}
      <div className="hidden lg:block">
        <RequestToRentButton />
      </div>

      {/* Request Button */}
      <div>
        {/* <div className="font-bold">Send a message to the owner</div> */}
        <form className="grid grid-cols-8 content-end gap-x-2">
          <div className="col-span-6">
            <RaInput

              type="text"
              name="message"
              label="Send a message to the owner"
              placeholderText="Is this available?"
            >
            </RaInput>
          </div>
          <div className="col-span-2 flex items-end">
            <RaButton btnText="Send" />
          </div>
        </form>
      </div>

      <div className="text-center text-muted font-light text-sm"> You won't be charged yet</div>
    </RaCard>
  )
}

export default SummaryCard