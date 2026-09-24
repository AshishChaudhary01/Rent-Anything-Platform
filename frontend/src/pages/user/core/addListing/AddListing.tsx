import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import type { MediaFile } from "../../../../components/upload/RaMediaUpload"
import AddListingForm from "./AddListingForm"
import AddListingSummary from "./AddListingSummary"

export type ListingForm = {
  title: string
  category: string
  description: string
  rate: string
  deposit: string
  location: string
  latitude: number | null
  longitude: number | null
  media: MediaFile[]
}

const emptyForm: ListingForm = {
  title: "",
  category: "",
  description: "",
  rate: "",
  deposit: "",
  location: "",
  latitude: null,
  longitude: null,
  media: [],
}

function AddListing() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [form, setForm] = useState<ListingForm>(emptyForm)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6 pb-10">
          <div className="col-span-full lg:col-span-6">
            <AddListingForm value={form} onChange={setForm} />
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <AddListingSummary form={form} />
          </aside>
          {isMobile && (
            <RaBottomSheet>
              <AddListingSummary form={form} />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default AddListing
