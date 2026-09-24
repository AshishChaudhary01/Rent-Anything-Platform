import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import MyListingDetailsMain from "./MyListingDetailsMain"
import MyListingDetailsSummary from "./MyListingDetailsSummary"
import type { MediaItem } from "../../../../components/mediaGallery/MediaGallery"
import { raToast } from "../../../../lib/raToast"
import { useListing, useUpdateListing } from "../../../../hooks/queries/useListings"
import type { Listing } from "../../../../types/listing.types"

export type ListingDraftMedia = MediaItem & { file?: File }

export type ListingDraft = {
  title: string
  description: string
  rate: string
  deposit: string
  location: string
  status: Listing["status"]
  media: ListingDraftMedia[]
}

function toDraft(listing: Listing): ListingDraft {
  return {
    title: listing.title,
    description: listing.description,
    rate: String(listing.dailyRate),
    deposit: String(listing.deposit),
    location: listing.location,
    status: listing.status,
    media: listing.media.map((item) => ({
      type: item.type === "video" ? "video" : "image",
      url: item.url,
    })),
  }
}

function MyListingDetails() {
  const { id } = useParams()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { data, isPending, isError } = useListing(id)
  const { mutate: saveListing, isPending: saving } = useUpdateListing()
  const [editing, setEditing] = useState(false)
  const [listing, setListing] = useState<ListingDraft | null>(null)
  const [saved, setSaved] = useState<ListingDraft | null>(null)

  useEffect(() => {
    if (!data || editing) return
    const draft = toDraft(data)
    setListing(draft)
    setSaved(draft)
  }, [data, editing])

  if (isPending || !listing || !saved) {
    return <div className="px-6 py-10 text-muted">Loading listing…</div>
  }
  if (isError || !data) {
    return <div className="px-6 py-10 text-muted">This listing is not available.</div>
  }

  const persist = (draft: ListingDraft, extras?: { status?: Listing["status"] }) => {
    if (!id) return
    if (data.status === "RENTED" || data.activeBooking) {
      raToast.error("You cannot update a listing while it is busy with a rental")
      return
    }
    const keepUrls = draft.media.filter((item) => !item.file).map((item) => item.url)
    const files = draft.media.filter((item) => item.file).map((item) => item.file!)
    saveListing(
      {
        id,
        payload: {
          title: draft.title,
          description: draft.description,
          dailyRate: draft.rate,
          deposit: draft.deposit || "0",
          location: draft.location,
          latitude: data.latitude,
          longitude: data.longitude,
          status: extras?.status ?? draft.status,
          keepUrls,
          files,
        },
      },
      {
        onSuccess: (updated) => {
          const next = toDraft(updated)
          setListing(next)
          setSaved(next)
          setEditing(false)
          raToast.success("Listing updated")
        },
        onError: (error) => raToast.fromError(error, "Could not update listing"),
      },
    )
  }

  const pauseListing = () => {
    if (listing.status === "RENTED") {
      raToast.error("You cannot pause a listing while it is currently rented")
      return
    }
    if (listing.status === "AVAILABLE") {
      persist(listing, { status: "UNAVAILABLE" })
      return
    }
    if (listing.status === "UNAVAILABLE") {
      persist(listing, { status: "AVAILABLE" })
      return
    }
    raToast.error("Only an active listing can be paused")
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6 pb-10">
          <div className="col-span-full lg:col-span-6">
            <MyListingDetailsMain
              listing={listing}
              listingId={data.id}
              activity={data.activity}
              editing={editing}
              saving={saving}
              status={listing.status}
              busy={data.status === "RENTED" || Boolean(data.activeBooking)}
              onChange={setListing}
              onEdit={() => setEditing(true)}
              onSave={() => persist(listing)}
              onCancel={() => {
                setListing(saved)
                setEditing(false)
              }}
            />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <MyListingDetailsSummary
              listing={listing}
              listingId={data.id}
              booking={data.activeBooking}
              activity={data.activity}
              editing={editing}
              saving={saving}
              onChange={setListing}
              onPause={pauseListing}
            />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <MyListingDetailsSummary
                listing={listing}
                listingId={data.id}
                booking={data.activeBooking}
                activity={data.activity}
                editing={editing}
                saving={saving}
                onChange={setListing}
                onPause={pauseListing}
              />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyListingDetails
