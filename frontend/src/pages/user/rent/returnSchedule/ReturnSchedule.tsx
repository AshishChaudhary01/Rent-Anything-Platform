import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoChatbubbleOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import LocationPicker from "../../../../components/maps/RaLocationPicker"
import ReturnFlowHeader from "../ReturnFlowHeader"

function ReturnSchedule() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ date: "", time: "", location: "" })
  const ready = Boolean(form.date && form.time && form.location)

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={0} />

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
            <div className="font-semibold">Meetup Location</div>
            <LocationPicker
              mapClass="h-48"
              value={form.location ? { address: form.location, lat: 0, lng: 0 } : null}
              onChange={(loc) => setForm({ ...form, location: loc.address })}
            />
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="font-semibold">Need to coordinate?</div>
            <Link to="/user/chat">
              <RaButton type="button" btnText="Chat with Owner" variant="outline" icon={<IoChatbubbleOutline />} iconPosition="left" />
            </Link>
          </RaCard>

          <RaButton
            type="button"
            btnText="Continue"
            disabled={!ready}
            clickFunc={() => navigate("/user/rent/condition-proof")}
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReturnSchedule
