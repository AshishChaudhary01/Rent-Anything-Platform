import { Link } from "react-router-dom"
import { IoCalendarOutline, IoStarOutline, IoTimeOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import PendingRentalCard from "./PendingRentalCard"
import ActiveRentalCard from "./ActiveRentalCard"
import StarRating from "../../../../components/rating/StarRating"
import { useMyRentals } from "../../../../hooks/queries/useRentals"
import type { RentalStatus } from "../../../../types/rental.types"

const historyPath = "/user/rental-history"
const pendingPath = "/user/pending-requests"
const activePath = "/user/active-rentals"
const previewGrid = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

function pendingLabel(status: string) {
  if (status === "REQUESTED") return "Waiting for owner"
  if (status === "PENDING_PAYMENT") return "Accepted — pay now"
  if (status === "PAID") return "Paid — meetup pending"
  if (status === "MEETUP_CONFIRMED") return "Meetup done — pay remaining"
  return status
}

function pastLabel(status: RentalStatus) {
  if (status === "COMPLETED") return "Completed"
  if (status === "CANCELLED") return "Cancelled"
  if (status === "DECLINED") return "Declined"
  return status
}

function pastBadge(status: RentalStatus) {
  if (status === "COMPLETED") return "success" as const
  if (status === "DECLINED" || status === "CANCELLED") return "accent" as const
  return "primary" as const
}

function MyRentals() {
  const { data: rentals = [], isPending } = useMyRentals()
  const active = rentals.filter((item) => item.status === "ACTIVE")
  const pending = rentals.filter((item) => item.status === "REQUESTED" || item.status === "PENDING_PAYMENT" || item.status === "PAID" || item.status === "MEETUP_CONFIRMED")
  const past = rentals.filter((item) => item.status === "COMPLETED" || item.status === "CANCELLED" || item.status === "DECLINED")
  const rated = past.filter((item) => item.myRating)
  const average = rated.length
    ? rated.reduce((sum, item) => sum + Number(item.myRating), 0) / rated.length
    : 0

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-8 pb-8">
          <div>
            <div className="text-xl md:text-2xl font-bold">My Rentals</div>
            <div className="text-sm md:text-base font-light text-muted">Requests, active rentals, and past reviews.</div>
          </div>

          <RaCard round="round" bg="accent" styleClass="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4!">
            <div>
              <div className="text-sm text-muted">Your rating overview</div>
              <div className="font-semibold">Ratings you left on completed rentals</div>
            </div>
            {rated.length === 0 ? (
              <div className="text-sm text-muted">No ratings yet</div>
            ) : (
              <StarRating value={average} readOnly size="sm" showValue />
            )}
          </RaCard>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Active rentals</div>
              <Link to={activePath} className="text-sm text-primary">See all</Link>
            </div>
            <div className={previewGrid}>
              {isPending && <p className="text-sm text-muted">Loading…</p>}
              {!isPending && active.length === 0 && <p className="text-sm text-muted">No active rentals yet.</p>}
              {active.slice(0, 3).map((item) => (
                <ActiveRentalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    image: item.listingImage,
                    title: item.listingTitle,
                    returns: `Until ${item.endDate}`,
                    amount: `Nrs. ${Number(item.rentalTotal).toLocaleString()}`,
                    returnScheduled: item.returnScheduled,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Pending requests</div>
              <Link to={pendingPath} className="text-sm text-primary">See all</Link>
            </div>
            <div className={previewGrid}>
              {!isPending && pending.length === 0 && <p className="text-sm text-muted">No pending requests.</p>}
              {pending.slice(0, 3).map((item) => (
                <PendingRentalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    image: item.listingImage,
                    title: item.listingTitle,
                    status: pendingLabel(item.status),
                    rentalStatus: item.status,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Past experiences</div>
              <Link to={historyPath} className="text-sm text-primary">See all</Link>
            </div>
            <div className={previewGrid}>
              {past.slice(0, 6).map((item) => (
                <RaCard key={item.id} round="round" bg={item.status === "COMPLETED" ? "success" : "white"} styleClass="flex flex-col p-4!">
                  <Link to={`/user/rental-details?rentalId=${item.id}`} className="flex gap-3 items-start">
                    <img src={item.listingImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-base truncate">{item.listingTitle}</div>
                        <RaBadge badgeText={pastLabel(item.status)} size="sm" variant={pastBadge(item.status)} />
                      </div>
                      <div className="flex items-center gap-x-2 text-xs text-muted">
                        <IoCalendarOutline className="size-3.5 text-primary" />
                        <span>{item.startDate}</span>
                        <IoTimeOutline className="size-3.5 text-primary ml-2" />
                        <span>{item.days}d</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-end justify-between mt-4 gap-2">
                    <div className="font-bold text-primary text-sm">Nrs. {Number(item.rentalTotal).toLocaleString()}</div>
                    {item.myRating ? (
                      <div className="flex flex-col items-end gap-1">
                        <StarRating value={item.myRating} readOnly size="sm" showValue />
                        <Link to={`/user/rent/rate?rentalId=${item.id}`} className="text-xs font-bold text-primary">Edit</Link>
                      </div>
                    ) : item.status === "COMPLETED" && item.canReview ? (
                      <Link to={`/user/rent/rate?rentalId=${item.id}`} className="text-xs font-bold text-success flex items-center gap-1">
                        <IoStarOutline /> Rate
                      </Link>
                    ) : (
                      <Link to={`/user/rental-details?rentalId=${item.id}`} className="text-xs font-bold text-primary">Details</Link>
                    )}
                  </div>
                </RaCard>
              ))}
              {!isPending && past.length === 0 && (
                <div className="flex items-center justify-center w-full text-muted py-8 col-span-full">
                  No past rentals yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyRentals
