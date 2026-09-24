import { useState } from "react"
import { Link } from "react-router-dom"
import { IoLocationOutline, IoShieldCheckmarkOutline, IoStorefrontOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import RaButton from "../../../../components/button/RaButton"
import Divider from "../../../../components/divider/Divider"
import RaInput from "../../../../components/input/RaInput"
import RequestToRentButton from "./RequestToRentButton"
import ChatLink from "../../core/chat/ChatLink"
import ReportLink from "../../../../components/report/ReportLink"
import ListingActivityCalendar from "../../../../components/calendar/ListingActivityCalendar"
import type { Listing } from "../../../../types/listing.types"

function SummaryCard({ listing }: { listing: Listing }) {
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-col gap-y-4">
    <RaCard styleClass="flex flex-col gap-y-4">
      <div className="font-medium flex justify-between lg:justify-start items-end">
        <div className="flex justify-between lg:justify-start gap-x-2">
          <p className="text-primary text-lg md:text-3xl font-bold">
            Nrs. {Number(listing.dailyRate).toLocaleString()}
          </p>
          <p className="flex items-end">/ day</p>
        </div>

        <div className="lg:hidden flex justify-end">
          {listing.owner ? (
            <RaBadge badgeText="You own this" variant="warning" size="sm" icon={<IoStorefrontOutline />} iconPosition="left" />
          ) : (
            <RequestToRentButton listing={listing} />
          )}
        </div>
      </div>
      <Divider />

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoLocationOutline className="size-4" />
            <p>Location</p>
          </div>
          <p className="font-bold text-right max-w-[60%]">{listing.location}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoShieldCheckmarkOutline className="size-4" />
            <p>Security Deposit</p>
          </div>
          <p className="font-bold">Nrs. {Number(listing.deposit).toLocaleString()}</p>
        </div>
        <p className="font-light text-sm text-muted">* Refundable upon safe return</p>
        {!listing.owner && (
          <p className="text-sm text-muted">
            Listed by{" "}
            <Link to={`/user/people/${listing.ownerId}`} className="font-semibold text-primary">
              {listing.ownerName}
            </Link>
          </p>
        )}
        {listing.status === "RENTED" && (
          <p className="text-sm text-warning">Some dates are booked. Check the calendar and request a free window.</p>
        )}
      </div>
      <Divider />

      {listing.owner ? (
        <div className="rounded-2xl bg-soft-warning border-2 border-warning p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RaBadge badgeText="You own this item" variant="warning" size="md" icon={<IoStorefrontOutline className="size-4" />} iconPosition="left" />
          </div>
          <p className="font-semibold">This listing is yours. Renters see the public page; you manage it here.</p>
          <Link to={`/user/my-listing-details/${listing.id}`}>
            <RaButton type="button" btnText="Manage listing" />
          </Link>
          <Link to={`/user/listing-requests?listingId=${listing.id}`}>
            <RaButton type="button" btnText="See requests" variant="secondary" />
          </Link>
        </div>
      ) : (
        <div className="hidden lg:block">
          <RequestToRentButton listing={listing} />
        </div>
      )}

      {!listing.owner && (
        <>
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
                listingId={listing.id}
                draft={message || "Is this available?"}
                btnText="Send"
                variant="primary"
                icon={undefined}
              />
            </div>
          </div>
          <div className="text-center text-muted font-light text-sm"> You won't be charged yet</div>
        </>
      )}
      {!listing.owner && (
        <ReportLink
          draft={{
            context: "listing",
            listingTitle: listing.title,
            accusedName: listing.ownerName,
            accusedId: listing.ownerId,
            listingId: listing.id,
            reason: "Listing policy violation",
          }}
          btnText="Report this listing"
          variant="lean"
          widthFill
        />
      )}
    </RaCard>
    <div className="hidden lg:block">
      <ListingActivityCalendar
        windows={listing.activity}
        title={listing.status === "RENTED" ? "Busy dates" : "Availability"}
        compact
      />
    </div>
    </div>
  )
}

export default SummaryCard
