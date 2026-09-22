import { Link } from "react-router-dom"
import { IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaInput from "../../../../components/input/RaInput"
import Divider from "../../../../components/divider/Divider"
import type { ListingDraft } from "./MyListingDetails"
import { raToast } from "../../../../lib/raToast"

function MyListingDetailsSummary({
  listing,
  editing,
  onChange,
}: {
  listing: ListingDraft
  editing: boolean
  onChange: (listing: ListingDraft) => void
}) {
  return (
    <div className="flex flex-col gap-y-4">
      {!editing && (
        <div className="lg:hidden flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <p className="text-primary text-xl font-bold">Nrs. {listing.rate} <span className="text-sm font-medium text-inherit">/ day</span></p>
          </div>
          <Link to="/user/rent/return-schedule?role=owner">
            <RaButton type="button" btnText="Cancel Active Rental" variant="danger" size="sm" />
          </Link>
          <RaButton type="button" btnText="Pause Listing" variant="outline" size="sm" clickFunc={() => raToast.success("Listing paused")} />
        </div>
      )}

      {!editing && (
        <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-1">
          <div className="font-semibold">Active Rental</div>
          <div className="text-sm text-muted">Rented to Anish Sharma</div>
          <div className="text-sm font-medium">Oct 24 - Oct 27</div>
        </RaCard>
      )}

      <RaCard styleClass="flex flex-col gap-y-4">
      {editing ? (
        <RaInput name="rate" label="Rate / day" value={listing.rate} onChange={(e) => onChange({ ...listing, rate: e.target.value })} />
      ) : (
        <div className="hidden lg:flex gap-x-2 items-end">
          <p className="text-primary text-lg md:text-3xl font-bold">Nrs. {listing.rate}</p>
          <p>/ day</p>
        </div>
      )}

      <Divider />

      {editing ? (
        <>
          <RaInput name="location" label="Location" value={listing.location} onChange={(e) => onChange({ ...listing, location: e.target.value })} />
          <RaInput name="deposit" label="Deposit" value={listing.deposit} onChange={(e) => onChange({ ...listing, deposit: e.target.value })} />
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex gap-x-2 items-center text-muted">
              <IoLocationOutline className="size-4" />
              Location
            </div>
            <p className="font-bold">{listing.location}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-x-2 items-center text-muted">
              <IoShieldCheckmarkOutline className="size-4" />
              Deposit
            </div>
            <p className="font-bold">Nrs. {listing.deposit}</p>
          </div>
        </>
      )}

      <Divider />

      {!editing && (
        <div className="hidden lg:flex flex-col gap-y-4">
          <Link to="/user/rent/return-schedule?role=owner">
            <RaButton type="button" btnText="Cancel Active Rental" variant="danger" />
          </Link>
          <RaButton type="button" btnText="Pause Listing" variant="outline" clickFunc={() => raToast.success("Listing paused")} />
        </div>
      )}
      </RaCard>
    </div>
  )
}

export default MyListingDetailsSummary
