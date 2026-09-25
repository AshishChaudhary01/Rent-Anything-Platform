import { useState } from "react"
import { Link } from "react-router-dom"
import { IoArrowBackOutline, IoCalendarOutline } from "react-icons/io5"
import RaBadge from "../../../../components/badge/RaBadge"
import RaCard from "../../../../components/card/RaCard"
import MediaGallery, { type MediaItem } from "../../../../components/mediaGallery/MediaGallery"
import ChatLink from "../../core/chat/ChatLink"
import ReportLink from "../../../../components/report/ReportLink"
import type { Rental } from "../../../../types/rental.types"
import type { Listing } from "../../../../types/listing.types"

function statusLabel(status: Rental["status"]) {
  if (status === "ACTIVE") return "Active rental"
  if (status === "PAID") return "Paid — meetup pending"
  if (status === "MEETUP_CONFIRMED") return "Meetup confirmed — pay remaining"
  if (status === "PENDING_PAYMENT") return "Awaiting payment"
  return status
}

function RentalDetailsMain({
  rental,
  listing,
}: {
  rental: Rental
  listing?: Listing
}) {
  const [note, setNote] = useState("")
  const peerName = rental.owner ? rental.renterName : rental.ownerName
  const peerId = rental.owner ? rental.renterId : rental.ownerId
  const backTo = rental.owner ? `/user/request-details/${rental.id}` : "/user/my-rentals"
  const media: MediaItem[] = listing?.media.map((item) => ({
    type: item.type === "video" ? "video" : "image",
    url: item.url,
  })) ?? (rental.listingImage ? [{ type: "image", url: rental.listingImage }] : [])

  return (
    <div className="flex flex-col gap-y-4">
      <Link to={backTo} className="flex items-center gap-x-1 text-muted text-sm">
        <IoArrowBackOutline className="size-4" />
        Back
      </Link>

      <div className="flex items-center gap-x-3">
        <RaBadge badgeText={statusLabel(rental.status)} size="sm" />
        <div className="text-sm text-muted flex items-center gap-1">
          <IoCalendarOutline className="size-4" />
          {rental.startDate} – {rental.endDate}
        </div>
      </div>

      {media.length > 0 && <MediaGallery media={media} />}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl md:text-2xl font-bold">{rental.listingTitle}</div>
          <Link to={`/user/people/${peerId}`} className="text-sm text-primary">
            {rental.owner ? `Renter: ${peerName}` : `Owner: ${peerName}`}
          </Link>
        </div>
        <ReportLink
          draft={{
            context: "rental",
            listingTitle: rental.listingTitle,
            listingId: rental.listingId,
            accusedName: peerName,
            accusedId: peerId,
            rentalId: rental.id,
          }}
          btnText="Report issue"
        />
      </div>
      {listing?.description && (
        <p className="font-light text-muted whitespace-pre-wrap">{listing.description}</p>
      )}

      <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-3">
        <div className="font-semibold">Message {peerName}</div>
        <div className="flex gap-2 items-end">
          <input
            className="flex-1 bg-white border border-muted/20 p-3 rounded-full outline-0"
            placeholder="Ask about the item..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <ChatLink
            rentalId={rental.id}
            draft={note || "Ask about the item..."}
            btnText="Send"
            size="sm"
            widthFill={false}
            variant="primary"
            icon={undefined}
          />
        </div>
      </RaCard>
    </div>
  )
}

export default RentalDetailsMain
