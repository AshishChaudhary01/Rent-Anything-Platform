import { IoDocumentTextOutline, IoImagesOutline, IoLocationOutline, IoPricetagOutline } from "react-icons/io5"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaInput from "../../../../components/input/RaInput"
import LocationPicker from "../../../../components/maps/RaLocationPicker"
import RaMediaUpload from "../../../../components/upload/RaMediaUpload"
import { categories } from "../../../../components/categoryBar/CategoryBar"
import type { ListingForm } from "./AddListing"

function AddListingForm({
  value,
  onChange,
}: {
  value: ListingForm
  onChange: (form: ListingForm) => void
}) {
  const set = (patch: Partial<ListingForm>) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-col gap-y-6">
      <RaBreadcrumb items={[
        { label: "My Listings", path: "/user/my-listings" },
        { label: "Add Listing" },
      ]} />

      <div>
        <div className="text-xl md:text-2xl font-bold">Add Listing</div>
        <div className="text-sm md:text-base font-light text-muted">
          Share an item for rent. Add photos, details, and a meetup area.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <IoImagesOutline className="size-5 text-primary" />
          Photos & videos
        </div>
        <RaMediaUpload heading="Add photos or videos" onChange={(media) => set({ media })} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <IoDocumentTextOutline className="size-5 text-primary" />
          Item details
        </div>
        <RaInput
          name="title"
          label="Title"
          placeholderText="e.g. Sony A7R IV Kit"
          value={value.title}
          onChange={(e) => set({ title: e.target.value })}
        />
        <div className="grid gap-3">
          <label className="font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const slug = cat.path.split("/").pop() || ""
              const active = value.category === slug
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set({ category: slug })}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm border cursor-pointer ${
                    active ? "bg-primary text-white border-primary" : "bg-white border-gray-200 text-muted"
                  }`}
                >
                  <Icon className="size-3" />
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid gap-3">
          <label className="font-medium">Description</label>
          <textarea
            className="bg-surface border border-muted/20 p-3 rounded-2xl outline-0 min-h-28"
            placeholder="Condition, what's included, and how to use it."
            value={value.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <IoPricetagOutline className="size-5 text-primary" />
          Pricing
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RaInput
            name="rate"
            label="Rate / day (Nrs.)"
            placeholderText="999"
            value={value.rate}
            onChange={(e) => set({ rate: e.target.value })}
          />
          <RaInput
            name="deposit"
            label="Security deposit (Nrs.)"
            placeholderText="10000"
            value={value.deposit}
            onChange={(e) => set({ deposit: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <IoLocationOutline className="size-5 text-primary" />
          Meetup area
        </div>
        <LocationPicker
          mapClass="h-48"
          value={value.location ? { address: value.location, lat: value.latitude || 0, lng: value.longitude || 0 } : null}
          onChange={(loc) => set({ location: loc.address, latitude: loc.lat, longitude: loc.lng })}
        />
      </div>
    </div>
  )
}

export default AddListingForm
