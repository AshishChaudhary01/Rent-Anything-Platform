import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline, IoBagHandleOutline, IoBanOutline, IoPauseOutline, IoPersonOutline, IoRefreshOutline, IoSwapHorizontalOutline } from "react-icons/io5"
import { AdminSectionTitle } from "../../../components/admin/AdminPageHeader"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import { runConfirmedAction } from "../../../lib/criticalAction"
import { statusClass } from "../../../components/admin/adminUi"
import { profile01 } from "../../../utils/images"
import { useAdminListings, useAdminRentals, useAdminUser, useSetAdminUserStatus } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

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
  const { data: user, isPending } = useAdminUser(id)
  const { data: listings = [] } = useAdminListings()
  const { data: rentals = [] } = useAdminRentals()
  const setUserStatus = useSetAdminUserStatus()

  if (isPending) {
    return <RaPageLoader label="Loading user…" />
  }

  if (!user) {
    return <div className="text-muted">User not found. <Link to="/admin/users" className="text-primary">Back</Link></div>
  }

  const theirListings = listings.filter((item) => item.ownerId === user.id)
  const theirRentals = rentals.filter((item) => item.ownerId === user.id || item.renterId === user.id)
  const listingPreview = theirListings.slice(0, 3)
  const rentalPreview = theirRentals.slice(0, 3)

  const changeStatus = async (status: string, message: string, confirm: { title: string; body: string; confirmText: string; danger?: boolean }, undo?: boolean) => {
    const previous = user.status
    await runConfirmedAction({
      confirm: { ...confirm, danger: confirm.danger ?? true },
      run: () => setUserStatus.mutateAsync({ id: user.id, status }),
      success: message,
      undo: undo
        ? () => setUserStatus.mutateAsync({ id: user.id, status: previous })
        : undefined,
    })
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <Link to="/admin/users" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Users
      </Link>
      <RaCard round="round" styleClass="p-4! flex items-center gap-4">
        <img src={user.avatarUrl || profile01} alt="" className="size-16 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-lg">{user.fullName}</div>
          <div className="text-sm text-muted">{user.email} · {user.phone}</div>
          <div className="text-sm text-muted">{user.id} · Joined {user.joined}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.status)}`}>{user.status}</span>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-2">
        <div className="mb-1">
          <AdminSectionTitle icon={IoPersonOutline}>Profile</AdminSectionTitle>
        </div>
        <Row label="Full name">{user.fullName}</Row>
        <Row label="Email">{user.email}</Row>
        <Row label="Phone">{user.phone || "—"}</Row>
        <Row label="Address">{user.addressLine || "—"}</Row>
        <Row label="City">{user.city || "—"}</Row>
        <Row label="District">{user.district || "—"}</Row>
        <Row label="Location">{user.location || "—"}</Row>
        <Row label="KYC">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(user.kycStatus)}`}>{user.kycStatus}</span>
        </Row>
        {user.kycRaw !== "NOT_STARTED" && (
          <Link to={`/admin/kyc/${user.id}`} className="text-sm text-primary pt-1">Open KYC case</Link>
        )}
      </RaCard>

      {user.role === "USER" && (
        <div className="flex gap-2">
          {user.status !== "Suspended" && (
            <RaButton type="button" btnText="Suspend" variant="outline" icon={<IoPauseOutline />} iconPosition="left" clickFunc={() => void changeStatus("Suspended", `${user.fullName} suspended`, { title: "Suspend this account?", body: `${user.fullName} will not be able to rent or list until restored.`, confirmText: "Suspend" }, true)} />
          )}
          {user.status !== "Banned" && (
            <RaButton type="button" btnText="Ban user" variant="danger" icon={<IoBanOutline />} iconPosition="left" clickFunc={() => void changeStatus("Banned", `${user.fullName} banned`, { title: "Ban this account?", body: `${user.fullName} will be blocked from RAP until restored.`, confirmText: "Ban", danger: true }, true)} />
          )}
          {user.status !== "Active" && (
            <RaButton type="button" btnText="Restore" variant="outline" icon={<IoRefreshOutline />} iconPosition="left" clickFunc={() => void changeStatus("Active", "Account restored", { title: "Restore this account?", body: `${user.fullName} will be able to use RAP again.`, confirmText: "Restore", danger: false })} />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RaCard round="round" styleClass="p-4! flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <AdminSectionTitle icon={IoBagHandleOutline}>Listings ({theirListings.length})</AdminSectionTitle>
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
                  <div className="text-xs text-muted">#{item.id.slice(0, 8)} · {item.status}</div>
                </div>
              </Link>
            ))
          )}
        </RaCard>
        <RaCard round="round" styleClass="p-4! flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <AdminSectionTitle icon={IoSwapHorizontalOutline}>Rentals ({theirRentals.length})</AdminSectionTitle>
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
                  <div className="text-xs text-muted">{item.id.slice(0, 8)} · {item.status}</div>
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
