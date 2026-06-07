import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import MediaGallery, { type MediaItem } from "../../../../components/mediaGallery/MediaGallery";
import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../../../../utils/images";
import ListingDescription from "./ListingDescription";
import ListingReview from "./ListingReview";

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
      <RaBreadcrumb />

      {/* Listing Info */}
      <div className="flex flex-col gap-y-6">
        {/* Title */}
        <div className="text-xl md:text-2xl font-bold">Sony A7R IV Professional Kit</div>
        <div className="flex flex-col gap-6">
          {/* Gallery */}
          <div className="flex-1 max-h-300">
            <MediaGallery media={listingMedia} />
          </div>
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