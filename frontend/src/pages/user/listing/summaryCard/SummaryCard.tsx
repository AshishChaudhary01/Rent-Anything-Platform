import { useState } from "react"
import { IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import RaInput from "../../../../components/input/RaInput"
import RequestToRentButton from "./RequestToRentButton"
import ChatLink from "../../core/chat/ChatLink"
import { chatWithOwner } from "../../core/chat/chatData"
import { tools01 } from "../../../../utils/images"

function SummaryCard() {
  const [message, setMessage] = useState("")

  return (
    <RaCard styleClass="flex flex-col gap-y-4">
      <div className="font-medium flex justify-between lg:justify-start items-end">
        <div className="flex justify-between lg:justify-start gap-x-2">
          <p className="text-primary text-lg md:text-3xl font-bold">
            Nrs. 999
          </p>
          <p className="flex items-end">/ day</p>
        </div>

        <div className="lg:hidden flex justify-end">
          <RequestToRentButton />
        </div>
      </div>
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

      <div className="hidden lg:block">
        <RequestToRentButton />
      </div>

      <div className="grid grid-cols-8 content-end gap-x-2">
        <div className="col-span-6">
          <RaInput
            type="text"
            name="message"
            label="Send a message to the owner"
            placeholderText="Is this available?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="col-span-2 flex items-end">
          <ChatLink
            context={{
              ...chatWithOwner,
              listingImage: tools01,
              draft: message || "Is this available?",
            }}
            btnText="Send"
            variant="primary"
            icon={undefined}
          />
        </div>
      </div>

      <div className="text-center text-muted font-light text-sm"> You won't be charged yet</div>
    </RaCard>
  )
}

export default SummaryCard
