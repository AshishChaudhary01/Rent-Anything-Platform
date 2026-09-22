import { Link } from "react-router-dom"
import { IoClose, IoPencilOutline } from "react-icons/io5"
import RaBadge from "../../../../components/badge/RaBadge"
import RaButton from "../../../../components/button/RaButton"
import RaInput from "../../../../components/input/RaInput"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import MediaGallery from "../../../../components/mediaGallery/MediaGallery"
import RaMediaUpload, { type MediaFile } from "../../../../components/upload/RaMediaUpload"
import ListingReview from "../../listing/main/ListingReview"
import type { ListingDraft } from "./MyListingDetails"

function MyListingDetailsMain({
  listing,
  editing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  listing: ListingDraft
  editing: boolean
  onChange: (listing: ListingDraft) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}) {
  const addMedia = (files: MediaFile[]) => {
    onChange({
      ...listing,
      media: [
        ...listing.media,
        ...files.map((f) => ({
          type: (f.file.type.startsWith("video/") ? "video" : "image") as "image" | "video",
          url: f.url,
        })),
      ],
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <RaBreadcrumb items={[
        { label: "My Listings", path: "/user/my-listings" },
        { label: listing.title },
      ]} />

      {!editing && (
        <div className="flex items-center justify-between gap-3">
          <RaBadge badgeText="Rented" size="sm" />
          <RaButton
            type="button"
            btnText="Edit"
            size="sm"
            variant="outline"
            widthFill={false}
            icon={<IoPencilOutline />}
            iconPosition="left"
            clickFunc={onEdit}
          />
        </div>
      )}

      {editing && (
        <div className="flex justify-between gap-2">
          <span className="text-2xl font-bold text-muted">Edit</span>
          <div className="flex justify-end gap-2">
            <RaButton type="button" btnText="Save" size="sm" widthFill={false} clickFunc={onSave} />
            <RaButton type="button" btnText="Cancel" size="sm" variant="outline" widthFill={false} clickFunc={onCancel} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {editing ? (
          <div className="flex-1">
            <RaInput name="title" label="Title" value={listing.title} onChange={(e) => onChange({ ...listing, title: e.target.value })} />
          </div>
        ) : (
          <>
            <div className="text-xl md:text-2xl font-bold">{listing.title}</div>
            <Link to={`/user/listing-requests?listing=${encodeURIComponent(listing.title)}`} className="shrink-0">
              <RaButton type="button" btnText="View Requests" size="sm" widthFill={false} />
            </Link>
          </>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-3">
            {listing.media.map((item, i) => (
              <div key={`${item.url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-black">
                {item.type === "video" ? (
                  <video src={item.url} className="size-full object-cover" />
                ) : (
                  <img src={item.url} alt="" className="size-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => onChange({ ...listing, media: listing.media.filter((_, idx) => idx !== i) })}
                  className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                >
                  <IoClose className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <RaMediaUpload heading="Add photos or videos" onAdd={addMedia} />
        </div>
      ) : (
        <div className="flex-1">
          <MediaGallery media={listing.media} />
        </div>
      )}

      {editing ? (
        <div className="grid gap-3">
          <label className="font-medium">Description</label>
          <textarea
            className="bg-surface border border-muted/20 p-3 rounded-2xl outline-0 min-h-28"
            value={listing.description}
            onChange={(e) => onChange({ ...listing, description: e.target.value })}
          />
        </div>
      ) : (
        <p className="font-light text-muted">{listing.description}</p>
      )}

      {!editing && <ListingReview />}
    </div>
  )
}

export default MyListingDetailsMain
