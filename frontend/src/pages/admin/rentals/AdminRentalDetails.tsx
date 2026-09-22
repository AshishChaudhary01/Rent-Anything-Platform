import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import { useAdminStore } from "../../../store/adminStore"
import { statusClass } from "../../../components/admin/adminUi"

function AdminRentalDetails() {
  const { id } = useParams()
  const rentals = useAdminStore((s) => s.rentals)
  const rental = rentals.find((item) => item.id === id)

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
      <img src={rental.image} alt="" className="w-full max-h-56 object-cover rounded-2xl" />
      <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
        <div className="flex justify-between"><span className="text-muted">Listing</span><Link className="text-primary" to={`/admin/listings/${rental.listingId}`}>#{rental.listingId}</Link></div>
        <div className="flex justify-between"><span className="text-muted">Owner</span><Link className="text-primary" to={`/admin/users/${rental.ownerId}`}>{rental.ownerName}</Link></div>
        <div className="flex justify-between"><span className="text-muted">Renter</span><Link className="text-primary" to={`/admin/users/${rental.renterId}`}>{rental.renterName}</Link></div>
        <div className="flex justify-between"><span className="text-muted">Dates</span><span>{rental.startDate} → {rental.endDate}</span></div>
        <div className="flex justify-between"><span className="text-muted">Amount</span><span>Nrs. {rental.amount}</span></div>
        <div className="flex justify-between"><span className="text-muted">Platform fee</span><span>Nrs. {rental.platformFee}</span></div>
      </RaCard>
    </div>
  )
}

export default AdminRentalDetails
