import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import MyListingDetailsMain from "./MyListingDetailsMain"
import MyListingDetailsSummary from "./MyListingDetailsSummary"
import { backpack01, ladder01, tent01, tools01 } from "../../../../utils/images"
import type { MediaItem } from "../../../../components/mediaGallery/MediaGallery"

export type ListingDraft = {
  title: string
  description: string
  rate: string
  deposit: string
  location: string
  media: MediaItem[]
}

const initialListing: ListingDraft = {
  title: "Sony A7R IV Professional Kit",
  description: "Capture stunning detail with the Sony A7R IV. 61MP full-frame sensor, suitable for photos and 4K video.",
  rate: "999",
  deposit: "10000",
  location: "Lazimpat, Kathmandu",
  media: [
    { type: "image", url: tools01 },
    { type: "image", url: tent01 },
    { type: "image", url: backpack01 },
    { type: "image", url: ladder01 },
  ],
}

function MyListingDetails() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [editing, setEditing] = useState(false)
  const [listing, setListing] = useState(initialListing)
  const [saved, setSaved] = useState(initialListing)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6 pb-10">
          <div className="col-span-full lg:col-span-6">
            <MyListingDetailsMain
              listing={listing}
              editing={editing}
              onChange={setListing}
              onEdit={() => setEditing(true)}
              onSave={() => {
                setSaved(listing)
                setEditing(false)
              }}
              onCancel={() => {
                setListing(saved)
                setEditing(false)
              }}
            />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <MyListingDetailsSummary listing={listing} editing={editing} onChange={setListing} />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <MyListingDetailsSummary listing={listing} editing={editing} onChange={setListing} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyListingDetails
