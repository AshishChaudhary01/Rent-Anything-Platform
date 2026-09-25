import { Link } from "react-router-dom"
import { IoLocationOutline, IoPauseOutline, IoPlayOutline, IoListOutline, IoCashOutline, IoShieldCheckmarkOutline, IoPersonOutline, IoCalendarOutline, IoChatbubbleOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaInput from "../../../../components/input/RaInput"
import type { Listing } from "../../../../types/listing.types"
import type { ListingDraft } from "./MyListingDetails"
import ChatLink from "../chat/ChatLink"
import ListingActivityCalendar from "../../../../components/calendar/ListingActivityCalendar"
import { useOwnedRentals } from "../../../../hooks/queries/useRentals"
import { ownerDetailsPath, requestCardAction } from "../listingRequests/ownerRequestProgress"

function MyListingDetailsSummary({
  listing,
  listingId,
  booking,
  activity,
  editing,
  saving,
  onChange,
  onPause,
}: {
  listing: ListingDraft
  listingId: string
  booking?: Listing["activeBooking"]
  activity?: Listing["activity"]
  editing: boolean
  saving?: boolean
  onChange: (listing: ListingDraft) => void
  onPause: () => void
}) {
  const { data: owned = [] } = useOwnedRentals()
  const busy = listing.status === "RENTED" || Boolean(booking)
  const canPause = listing.status === "AVAILABLE" && !booking
  const canResume = listing.status === "UNAVAILABLE" && !booking
  const pauseLabel = canPause ? "Pause listing" : "Resume listing"
  const pauseDisabled = saving || busy || (!canPause && !canResume)
  const listingRequests = owned.filter((req) => req.listingId === listingId)
  const pending = listingRequests.filter((req) => req.status === "REQUESTED")
  const inProgress = listingRequests.filter((req) =>
    req.status === "PENDING_PAYMENT" || req.status === "PAID" || req.status === "MEETUP_CONFIRMED" || req.status === "ACTIVE",
  )

  return (
    <div className="flex flex-col gap-y-4">
      {!editing && pending.length > 0 && (
        <RaCard round="round" bg="warning" styleClass="flex flex-col gap-3">
          <div className="font-semibold">New request{pending.length === 1 ? "" : "s"}</div>
          {pending.slice(0, 3).map((req) => (
            <div key={req.id} className="flex flex-col gap-2">
              <div className="text-sm">
                {req.renterName} · {req.startDate} – {req.endDate}
              </div>
              <Link to={ownerDetailsPath(req.id)}>
                <RaButton type="button" btnText="Review request" size="sm" />
              </Link>
            </div>
          ))}
        </RaCard>
      )}

      {!editing && booking && (
        <RaCard round="round" bg={booking.status === "ACTIVE" ? "warning" : "success"} styleClass="flex flex-col gap-3">
          <div className="font-semibold flex items-center gap-2">
            <IoCalendarOutline className="size-5" />
            {booking.status === "ACTIVE" ? "Active rental" : "Upcoming rental"}
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-muted"><IoPersonOutline className="size-4" /> Renter</span>
            <span className="font-medium">{booking.renterName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-muted"><IoCalendarOutline className="size-4" /> Dates</span>
            <span className="font-medium">{booking.startDate} – {booking.endDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-muted"><IoLocationOutline className="size-4" /> Meetup</span>
            <span className="font-medium text-right max-w-[55%]">{booking.meetupLocation}</span>
          </div>
          <Link to={ownerDetailsPath(booking.rentalId)}>
            <RaButton type="button" btnText="See rental progress" />
          </Link>
          <ChatLink rentalId={booking.rentalId} btnText="Chat with renter" size="sm" variant="outline" icon={<IoChatbubbleOutline />} iconPosition="left" />
        </RaCard>
      )}

      {!editing && !booking && inProgress.length > 0 && (
        <RaCard round="round" bg="info" styleClass="flex flex-col gap-3">
          <div className="font-semibold">Open rental</div>
          <Link to={ownerDetailsPath(inProgress[0].id)}>
            <RaButton type="button" btnText={requestCardAction(inProgress[0].status)} />
          </Link>
        </RaCard>
      )}

      <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-4">
        {editing ? (
          <RaInput name="rate" label="Rate / day" value={listing.rate} onChange={(e) => onChange({ ...listing, rate: e.target.value })} />
        ) : (
          <div className="flex gap-x-2 items-end">
            <IoCashOutline className="size-6 text-primary" />
            <p className="text-primary text-lg md:text-3xl font-bold">Nrs. {listing.rate}</p>
            <p>/ day</p>
          </div>
        )}

        {editing ? (
          <>
            <RaInput name="location" label="Location" value={listing.location} onChange={(e) => onChange({ ...listing, location: e.target.value })} />
            <RaInput name="deposit" label="Deposit" value={listing.deposit} onChange={(e) => onChange({ ...listing, deposit: e.target.value })} />
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <div className="flex gap-x-2 items-center text-muted">
                <IoLocationOutline className="size-4 text-primary" />
                Location
              </div>
              <p className="font-bold text-right max-w-[60%]">{listing.location}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 items-center text-muted">
                <IoShieldCheckmarkOutline className="size-4 text-primary" />
                Deposit
              </div>
              <p className="font-bold">Nrs. {listing.deposit}</p>
            </div>
          </>
        )}

        {!editing && (
          <div className="flex flex-col gap-2">
            <Link to={`/user/listing-requests?listingId=${listingId}`}>
              <RaButton type="button" btnText="View requests" variant="secondary" icon={<IoListOutline />} iconPosition="left" />
            </Link>
            <RaButton
              type="button"
              btnText={pauseLabel}
              variant={canResume ? "success" : "ghost"}
              icon={canResume ? <IoPlayOutline /> : <IoPauseOutline />}
              iconPosition="left"
              disabled={pauseDisabled}
              clickFunc={onPause}
            />
            {busy && <div className="text-xs text-muted">This listing is busy, so it cannot be paused or edited.</div>}
          </div>
        )}
      </RaCard>

      {!editing && (
        <div className="hidden lg:block">
          <ListingActivityCalendar windows={activity} title="Activity" compact />
        </div>
      )}
    </div>
  )
}

export default MyListingDetailsSummary
