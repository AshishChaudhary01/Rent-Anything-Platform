import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaBadge from "../../../../components/badge/RaBadge"
import MediaGallery, { type MediaItem } from "../../../../components/mediaGallery/MediaGallery"
import ListingReview from "./ListingReview"
import ListingActivityCalendar from "../../../../components/calendar/ListingActivityCalendar"
import ReportLink from "../../../../components/report/ReportLink"
import type { Listing } from "../../../../types/listing.types"
import { IoStorefrontOutline } from "react-icons/io5"

function ListingMain({ listing }: { listing: Listing }) {
  const media: MediaItem[] = listing.media.map((item) => ({
    type: item.type === "video" ? "video" : "image",
    url: item.url,
  }))

  return (
    <div className="flex flex-col gap-y-4">
      <RaBreadcrumb items={[{ label: listing.title }]} />

      <div className="flex flex-col gap-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            {listing.owner && (
              <RaBadge badgeText="You own this item" variant="warning" size="md" icon={<IoStorefrontOutline />} iconPosition="left" />
            )}
            <div className="text-2xl md:text-3xl font-bold">{listing.title}</div>
          </div>
          {!listing.owner && (
            <ReportLink
              draft={{
                context: "listing",
                listingTitle: listing.title,
                accusedName: listing.ownerName,
                accusedId: listing.ownerId,
              }}
              btnText="Report listing"
            />
          )}
        </div>
        <div className="flex flex-col gap-6">
          {media.length > 0 && <MediaGallery media={media} />}
          <div className="flex-1">
            <div className="flex flex-col gap-y-4">
              <p className="text-xl md:text-2xl font-bold">Description</p>
              <p className="text-base md:text-lg font-light text-muted whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <ListingActivityCalendar
          windows={listing.activity}
          title={listing.status === "RENTED" ? "Busy dates" : "Availability"}
          compact
        />
      </div>

      <ListingReview listingId={listing.id} />
    </div>
  )
}

export default ListingMain
