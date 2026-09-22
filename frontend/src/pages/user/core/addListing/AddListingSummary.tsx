import { useNavigate } from "react-router-dom"
import { IoAddCircleOutline, IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import Divider from "../../../../components/divider/Divider"
import type { ListingForm } from "./AddListing"
import { raToast } from "../../../../lib/raToast"

function AddListingSummary({ form }: { form: ListingForm }) {
  const navigate = useNavigate()
  const ready = Boolean(form.title && form.category && form.rate && form.location && form.media.length)
  const preview = form.media[0]

  return (
    <div className="flex flex-col gap-y-4">
      <div className="lg:hidden">
        <RaButton
          type="button"
          btnText="Publish Listing"
          size="sm"
          disabled={!ready}
          icon={<IoAddCircleOutline />}
          iconPosition="left"
          clickFunc={() => {
            raToast.success("Listing published")
            navigate("/user/my-listings")
          }}
        />
      </div>

      <RaCard styleClass="flex flex-col gap-y-4">
        <div className="font-semibold">Preview</div>
        {preview ? (
          preview.file.type.startsWith("video/") ? (
            <video src={preview.url} className="w-full h-36 rounded-xl object-cover bg-black" />
          ) : (
            <img src={preview.url} alt="" className="w-full h-36 rounded-xl object-cover" />
          )
        ) : (
          <div className="w-full h-36 rounded-xl bg-surface flex items-center justify-center text-sm text-muted">
            Add a photo to preview
          </div>
        )}
        <div>
          <div className="font-semibold text-lg truncate">{form.title || "Untitled listing"}</div>
          <div className="text-sm text-muted">{form.category || "No category"}</div>
        </div>
        <div className="flex items-end gap-x-2">
          <p className="text-primary text-xl md:text-2xl font-bold">
            {form.rate ? `Nrs. ${form.rate}` : "Nrs. —"}
          </p>
          <p className="text-muted">/ day</p>
        </div>

        <Divider />

        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoLocationOutline className="size-4" />
            Location
          </div>
          <p className="font-bold text-right max-w-[60%] truncate">{form.location || "—"}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <IoShieldCheckmarkOutline className="size-4" />
            Deposit
          </div>
          <p className="font-bold">{form.deposit ? `Nrs. ${form.deposit}` : "—"}</p>
        </div>

        <Divider />

        <div className="hidden lg:flex flex-col gap-y-3">
          <RaButton
            type="button"
            btnText="Publish Listing"
            disabled={!ready}
            icon={<IoAddCircleOutline />}
            iconPosition="left"
            clickFunc={() => {
            raToast.success("Listing published")
            navigate("/user/my-listings")
          }}
          />
          <RaButton
            type="button"
            btnText="Cancel"
            variant="outline"
            clickFunc={() => navigate("/user/my-listings")}
          />
        </div>
        <div className="text-center text-muted font-light text-sm">
          Visible after you publish. You can edit it anytime.
        </div>
      </RaCard>
    </div>
  )
}

export default AddListingSummary
