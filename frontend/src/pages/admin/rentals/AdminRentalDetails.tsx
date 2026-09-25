import { Link, useParams } from "react-router-dom"
import {
  IoArrowBackOutline,
  IoBagHandleOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import { statusClass } from "../../../components/admin/adminUi"
import { useAdminRental } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

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
    <div className="flex items-start gap-2.5">
      <Icon className="size-5 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 flex justify-between gap-3 text-sm">
        <span className="text-muted shrink-0">{label}</span>
        <span className="text-right min-w-0 break-all">{children}</span>
      </div>
    </div>
  )
}

function AdminRentalDetails() {
  const { id } = useParams()
  const { data: rental, isPending } = useAdminRental(id)

  if (isPending) {
    return <RaPageLoader label="Loading rental…" />
  }

  if (!rental) {
    return <div className="text-muted">Rental not found. <Link to="/admin/rentals" className="text-primary">Back</Link></div>
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/admin/rentals" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Rentals
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{rental.listingTitle}</div>
          <div className="text-sm text-muted">{rental.id} · read only</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(rental.status)}`}>{rental.status}</span>
      </div>
      {rental.image && <img src={rental.image} alt="" className="w-full max-h-56 object-cover rounded-2xl" />}
      <RaCard round="round" styleClass="flex flex-col gap-3">
        <Fact icon={IoBagHandleOutline} label="Listing">
          <Link className="text-primary" to={`/admin/listings/${rental.listingId}`}>{rental.listingTitle}</Link>
        </Fact>
        <Fact icon={IoPersonOutline} label="Owner">
          <Link className="text-primary" to={`/admin/users/${rental.ownerId}`}>{rental.ownerName}</Link>
        </Fact>
        <Fact icon={IoPeopleOutline} label="Renter">
          <Link className="text-primary" to={`/admin/users/${rental.renterId}`}>{rental.renterName}</Link>
        </Fact>
        <Fact icon={IoCalendarOutline} label="Dates">{rental.startDate} → {rental.endDate}</Fact>
        <Fact icon={IoCashOutline} label="Amount">Nrs. {rental.amount}</Fact>
        <Fact icon={IoCashOutline} label="Platform fee">Nrs. {rental.platformFee}</Fact>
      </RaCard>
    </div>
  )
}

export default AdminRentalDetails
