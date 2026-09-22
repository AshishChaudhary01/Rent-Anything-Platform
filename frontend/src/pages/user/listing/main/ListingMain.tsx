import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import MediaGallery, { type MediaItem } from "../../../../components/mediaGallery/MediaGallery";
import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../../../../utils/images";
import ListingDescription from "./ListingDescription";
import ListingReview from "./ListingReview";
import ReportLink from "../../../../components/report/ReportLink";

const listingMedia: MediaItem[] = [
  { type: "image", url: tools01 },
  { type: "image", url: backpack01 },
  { type: "image", url: ladder01 },
  { type: "image", url: tent01 },
  { type: "image", url: pressureWasher01 },
  { type: "image", url: tools01 },
  { type: "image", url: backpack01 },
  { type: "image", url: ladder01 },
  { type: "image", url: tent01 },
  { type: "image", url: pressureWasher01 },
];
function ListingMain() {
  return (
    <div className="flex flex-col gap-y-4">
      <RaBreadcrumb items={[{ label: "Sony A7R IV Professional Kit" }]} />

      {/* Listing Info */}
      <div className="flex flex-col gap-y-6">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="text-2xl md:text-3xl font-bold">Sony A7R IV Professional Kit</div>
          <ReportLink
            draft={{
              context: "listing",
              listingTitle: "Sony A7R IV Professional Kit",
              accusedName: "Anish Sharma",
              accusedId: "u-anish",
            }}
            btnText="Report listing"
          />
        </div>
        <div className="flex flex-col gap-6">
          <MediaGallery media={listingMedia} />
          {/* Description */}
          <div className="flex-1">
            <ListingDescription />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ListingReview />
    </div>
  )
}

export default ListingMain