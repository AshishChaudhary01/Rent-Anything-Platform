import { useEffect, useState } from "react"
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
import { useRental, useScheduleReturn } from "../../../../hooks/queries/useRentals"
import { raToast } from "../../../../lib/raToast"

function ReturnSchedule() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)
  const schedule = useScheduleReturn()
  const isOwner = Boolean(rental?.owner)
  const [form, setForm] = useState({ date: "", time: "", location: "", lat: 0, lng: 0 })

  useEffect(() => {
    if (!rental) return
    if (rental.status !== "ACTIVE") {
      navigate(`/user/rental-details?rentalId=${rental.id}`, { replace: true })
    }
  }, [rental, navigate])

  useEffect(() => {
    if (!rental?.returnMeetupAt || form.date) return
    const at = new Date(rental.returnMeetupAt)
    const local = new Date(at.getTime() - at.getTimezoneOffset() * 60000)
    setForm({
      date: local.toISOString().slice(0, 10),
      time: local.toISOString().slice(11, 16),
      location: rental.returnMeetupLocation || rental.meetupLocation,
      lat: rental.returnMeetupLatitude || 0,
      lng: rental.returnMeetupLongitude || 0,
    })
  }, [rental, form.date])

  const ready = Boolean(form.date && form.time && form.location)

  const save = (next: "review" | "proof" | "meetup") => {
    if (!rental) return
    schedule.mutate(
      {
        id: rental.id,
        date: form.date,
        time: form.time,
        location: form.location,
        latitude: form.lat || undefined,
        longitude: form.lng || undefined,
      },
      {
        onSuccess: () => {
          raToast.success("Return meetup scheduled")
          if (next === "review") navigate(`/user/rent/owner-return-review?rentalId=${rental.id}`)
          else if (next === "proof") navigate(`/user/rent/condition-proof?rentalId=${rental.id}`)
          else navigate(`/user/rent/return-meetup?rentalId=${rental.id}`)
        },
        onError: (error) => raToast.fromError(error, "Could not schedule return"),
      },
    )
  }

  if (!rentalId) return <p className="px-6 py-10 text-muted">Choose an active rental first.</p>
  if (isPending || !rental) return <p className="px-6 py-10 text-muted">Loading rental…</p>

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
              Pick a meetup date, time, and place. Return is completed only after both of you scan QR at pickup.
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
              value={form.location ? { address: form.location, lat: form.lat, lng: form.lng } : null}
              onChange={(loc) => setForm({ ...form, location: loc.address, lat: loc.lat, lng: loc.lng })}
            />
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoChatbubbleOutline className="size-5 text-primary" />
              Need to coordinate?
            </div>
            <ChatLink rentalId={rental.id} btnText={isOwner ? `Chat with ${rental.renterName}` : `Chat with ${rental.ownerName}`} />
          </RaCard>

          {isOwner ? (
            <OwnerReturnNav
              onPrev={() => navigate(`/user/rental-details?rentalId=${rental.id}`)}
              onNext={() => save("review")}
              nextDisabled={!ready || schedule.isPending}
              nextText={schedule.isPending ? "Saving…" : "Continue"}
            />
          ) : (
            <RaButton
              type="button"
              btnText={schedule.isPending ? "Saving…" : "Continue"}
              disabled={!ready || schedule.isPending}
              clickFunc={() => save("proof")}
            />
          )}
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReturnSchedule
