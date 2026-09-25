import { Link, useParams } from "react-router-dom"
import {
  IoBanOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoShieldCheckmarkOutline,
  IoSwapHorizontalOutline,
  IoTrashOutline,
} from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaBreadcrumb from "../../../components/breadcrumb/RaBreadcrumb"
import MediaGallery from "../../../components/mediaGallery/MediaGallery"
import { profile01 } from "../../../utils/images"
import { raToast } from "../../../lib/raToast"
import { apiErrorMessage } from "../../../lib/formErrors"
import { statusClass } from "../../../components/admin/adminUi"
import { useAdminListing, useAdminRentals, useSetAdminListingStatus } from "../../../hooks/queries/useAdmin"

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 bg-surface rounded-xl px-3 py-2.5">
      <Icon className="size-5 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-sm text-muted">{label}</div>
        <div className="text-base font-medium truncate">{children}</div>
      </div>
    </div>
  )
}

function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function AdminListingDetails() {
  const { id } = useParams()
  const { data: listing, isPending } = useAdminListing(id)
  const { data: rentals = [] } = useAdminRentals()
  const setListingStatus = useSetAdminListingStatus()
  const activeRental = rentals.find((item) => item.listingId === listing?.id && item.status === "Active")

  if (isPending) {
    return <div className="text-muted">Loading listing…</div>
  }

  if (!listing) {
    return <div className="text-muted">Listing not found. <Link to="/admin/listings" className="text-primary">Back</Link></div>
  }

  const media = listing.image ? [{ type: "image" as const, url: listing.image }] : []

  const changeStatus = async (next: string, message: string) => {
    try {
      await setListingStatus.mutateAsync({ id: listing.id, status: next })
      raToast.success(message)
    } catch (error) {
      raToast.error(apiErrorMessage(error))
    }
  }

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      <RaBreadcrumb items={[
        { label: "Listings", path: "/admin/listings" },
        { label: listing.title },
      ]} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-2xl md:text-3xl font-bold">{listing.title}</div>
          <div className="text-base text-muted">#{listing.id}</div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full shrink-0 ${statusClass(listing.status)}`}>{listing.status}</span>
      </div>

      {media.length > 0 && <MediaGallery media={media} />}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <p className="text-base md:text-lg text-muted">{listing.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Fact icon={IoPricetagOutline} label="Category">{listing.category}</Fact>
            <Fact icon={IoLocationOutline} label="Location">{listing.location}</Fact>
            <Fact icon={IoCashOutline} label="Daily rate">Nrs. {listing.rate}</Fact>
            <Fact icon={IoShieldCheckmarkOutline} label="Deposit">Nrs. {listing.deposit}</Fact>
            <Fact icon={IoCalendarOutline} label="Listed">{formatDay(listing.createdAt)}</Fact>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-3">
          <RaCard round="round" styleClass="p-3! flex items-center gap-3">
            <img src={profile01} alt="" className="size-11 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted">Owner</div>
              <Link to={`/admin/users/${listing.ownerId}`} className="font-semibold text-primary truncate block">{listing.ownerName}</Link>
              <div className="text-xs text-muted truncate">{listing.ownerId}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="p-3! flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <IoSwapHorizontalOutline className="size-5 text-primary" />
              Active rental
            </div>
            {activeRental ? (
              <>
                <div className="flex items-center gap-3">
                  <img src={activeRental.image} alt="" className="size-12 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{activeRental.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted">{activeRental.startDate} → {activeRental.endDate}</div>
                  </div>
                </div>
                <div className="text-sm">Renter: <Link className="text-primary" to={`/admin/users/${activeRental.renterId}`}>{activeRental.renterName}</Link></div>
                <div className="text-sm text-muted">Nrs. {activeRental.amount} · fee {activeRental.platformFee}</div>
                <Link to={`/admin/rentals/${activeRental.id}`}>
                  <RaButton type="button" btnText="Open rental" size="sm" variant="outline" widthFill={false} />
                </Link>
              </>
            ) : (
              <div className="text-sm text-muted">No active rental on this listing.</div>
            )}
          </RaCard>
        </div>
      </div>

      <div className="flex gap-2">
        {listing.status === "Active" && (
          <RaButton type="button" btnText="Disable listing" variant="outline" icon={<IoBanOutline />} iconPosition="left" clickFunc={() => void changeStatus("Disabled", "Listing disabled")} />
        )}
        {listing.status !== "Removed" && (
          <RaButton type="button" btnText="Remove listing" variant="danger" icon={<IoTrashOutline />} iconPosition="left" clickFunc={() => void changeStatus("Removed", "Listing removed")} />
        )}
      </div>
    </div>
  )
}

export default AdminListingDetails
