import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import { useAdminStore } from "../../../store/adminStore"
import { raToast } from "../../../lib/raToast"
import { statusClass } from "../../../components/admin/adminUi"
import { profile01 } from "../../../utils/images"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-right min-w-0 break-all">{children}</span>
    </div>
  )
}

function AdminUserDetails() {
  const { id } = useParams()
  const users = useAdminStore((s) => s.users)
  const listings = useAdminStore((s) => s.listings)
  const rentals = useAdminStore((s) => s.rentals)
  const kycCases = useAdminStore((s) => s.kycCases)
  const setUserStatus = useAdminStore((s) => s.setUserStatus)
  const user = users.find((item) => item.id === id)

  if (!user) {
    return <div className="text-muted">User not found. <Link to="/admin/users" className="text-primary">Back</Link></div>
  }

  const theirListings = listings.filter((item) => item.ownerId === user.id)
  const theirRentals = rentals.filter((item) => item.ownerId === user.id || item.renterId === user.id)
  const kyc = kycCases.find((item) => item.userId === user.id)
  const listingPreview = theirListings.slice(0, 3)
  const rentalPreview = theirRentals.slice(0, 3)

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <Link to="/admin/users" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Users
      </Link>
      <RaCard round="round" styleClass="p-4! flex items-center gap-4">
        <img src={profile01} alt="" className="size-16 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-lg">{user.fullName}</div>
          <div className="text-sm text-muted">{user.email} · {user.phone}</div>
          <div className="text-sm text-muted">{user.id} · Joined {user.joined}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.status)}`}>{user.status}</span>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-2">
        <div className="font-semibold mb-1">Profile</div>
        <Row label="Full name">{user.fullName}</Row>
        <Row label="Email">{user.email}</Row>
        <Row label="Phone">{user.phone}</Row>
        <Row label="Address">{user.addressLine}</Row>
        <Row label="City">{user.city}</Row>
        <Row label="District">{user.district}</Row>
        <Row label="Location">{user.location}</Row>
        <Row label="Bio">{user.bio}</Row>
        <Row label="KYC">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.kycStatus)}`}>{user.kycStatus}</span>
        </Row>
        {kyc && (
          <Link to={`/admin/kyc/${kyc.id}`} className="text-sm text-primary pt-1">Open KYC case {kyc.id}</Link>
        )}
      </RaCard>

      {user.role === "USER" && (
        <div className="flex gap-2">
          {user.status !== "Suspended" && (
            <RaButton type="button" btnText="Suspend" variant="outline" clickFunc={() => { setUserStatus(user.id, "Suspended"); raToast.warning(`${user.fullName} suspended`) }} />
          )}
          {user.status !== "Banned" && (
            <RaButton type="button" btnText="Ban user" variant="danger" clickFunc={() => { setUserStatus(user.id, "Banned"); raToast.success(`${user.fullName} banned`) }} />
          )}
          {user.status !== "Active" && (
            <RaButton type="button" btnText="Restore" variant="outline" clickFunc={() => { setUserStatus(user.id, "Active"); raToast.success("Account restored") }} />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RaCard round="round" styleClass="p-4! flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold">Listings ({theirListings.length})</div>
            {theirListings.length > 0 && (
              <Link to={`/admin/users/${user.id}/listings`} className="text-sm text-primary">View all</Link>
            )}
          </div>
          {listingPreview.length === 0 ? (
            <div className="text-sm text-muted">No listings.</div>
          ) : (
            listingPreview.map((item) => (
              <Link key={item.id} to={`/admin/listings/${item.id}`} className="flex items-center gap-3">
                <img src={item.image} alt="" className="size-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-muted">#{item.id} · {item.status}</div>
                </div>
              </Link>
            ))
          )}
        </RaCard>
        <RaCard round="round" styleClass="p-4! flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold">Rentals ({theirRentals.length})</div>
            {theirRentals.length > 0 && (
              <Link to={`/admin/users/${user.id}/rentals`} className="text-sm text-primary">View all</Link>
            )}
          </div>
          {rentalPreview.length === 0 ? (
            <div className="text-sm text-muted">No rentals.</div>
          ) : (
            rentalPreview.map((item) => (
              <Link key={item.id} to={`/admin/rentals/${item.id}`} className="flex items-center gap-3">
                <img src={item.image} alt="" className="size-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.listingTitle}</div>
                  <div className="text-xs text-muted">{item.id} · {item.status}</div>
                </div>
              </Link>
            ))
          )}
        </RaCard>
      </div>
    </div>
  )
}

export default AdminUserDetails
