import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { IoCalendarOutline, IoChatbubbleOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import LocationPicker from "../../../../components/maps/RaLocationPicker"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { OWNER_RETURN_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { chatWithOwner, chatWithRenter } from "../../core/chat/chatData"

function ReturnSchedule() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isOwner = params.get("role") === "owner"
  const [form, setForm] = useState({ date: "", time: "", location: "" })
  const ready = Boolean(form.date && form.time && form.location)

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader
            current={0}
            title={isOwner ? "End Rental" : "Return Item"}
            steps={isOwner ? OWNER_RETURN_STEPS : undefined}
          />

          <div>
            <div className="text-xl font-bold">Schedule Return</div>
            <div className="text-sm md:text-base font-light text-muted">
              Pick a meetup date, time, and place.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RaInput type="date" name="date" label="Meetup Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <RaInput type="time" name="time" label="Meetup Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Location
            </div>
            <LocationPicker
              mapClass="h-48"
              value={form.location ? { address: form.location, lat: 0, lng: 0 } : null}
              onChange={(loc) => setForm({ ...form, location: loc.address })}
            />
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoChatbubbleOutline className="size-5 text-primary" />
              Need to coordinate?
            </div>
            <ChatLink
              context={isOwner ? chatWithRenter : chatWithOwner}
              btnText={isOwner ? "Chat with Renter" : "Chat with Owner"}
            />
          </RaCard>

          {isOwner ? (
            <OwnerReturnNav
              onPrev={() => navigate("/user/my-listing-details")}
              onNext={() => navigate("/user/rent/owner-return-review")}
              nextDisabled={!ready}
            />
          ) : (
            <RaButton
              type="button"
              btnText="Continue"
              disabled={!ready}
              clickFunc={() => navigate("/user/rent/condition-proof")}
            />
          )}
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReturnSchedule
