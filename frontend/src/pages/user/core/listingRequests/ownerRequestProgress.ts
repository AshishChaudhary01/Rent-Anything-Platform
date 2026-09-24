import type { Rental, RentalStatus } from "../../../../types/rental.types"
import { OWNER_RENT_STEPS } from "../../rent/returnSteps"

export { OWNER_RENT_STEPS }

export function ownerDetailsPath(rentalId: string) {
  return `/user/request-details/${rentalId}`
}

export function ownerRentStep(status: RentalStatus) {
  if (status === "REQUESTED") return 0
  if (status === "PENDING_PAYMENT") return 1
  if (status === "PAID") return 2
  if (status === "ACTIVE" || status === "COMPLETED") return 3
  return 0
}

export function ownerProgressHint(rental: Rental) {
  if (rental.status === "REQUESTED") return "Review this request, then accept or decline."
  if (rental.status === "PENDING_PAYMENT") return "You accepted. Waiting for the renter to pay the commitment fee."
  if (rental.status === "PAID") return "Paid. Meet the renter and scan QR to start the rental."
  if (rental.status === "ACTIVE" && rental.returnScheduled) return "Return meetup is set. Scan the return QR when you collect the item."
  if (rental.status === "ACTIVE") return "Rental is in progress. Open details when you are ready to schedule the return."
  if (rental.status === "COMPLETED") return "This rental is complete."
  if (rental.status === "DECLINED") return "You declined this request."
  return "This request was cancelled."
}

export function ownerNextAction(rental: Rental): { label: string; to: string } | null {
  if (rental.status === "PAID") {
    return { label: "Go to pickup / scan QR", to: `/user/rent/meetup?rentalId=${rental.id}` }
  }
  if (rental.status === "ACTIVE") {
    return {
      label: rental.returnScheduled ? "Continue return meetup" : "Schedule return",
      to: rental.returnScheduled
        ? `/user/rent/return-meetup?rentalId=${rental.id}`
        : `/user/rent/return-schedule?rentalId=${rental.id}`,
    }
  }
  if (rental.status === "COMPLETED") {
    return { label: "Open rental summary", to: `/user/rental-details?rentalId=${rental.id}` }
  }
  return null
}

export function requestCardLabel(status: RentalStatus) {
  if (status === "REQUESTED") return "Pending"
  if (status === "PENDING_PAYMENT") return "Waiting for payment"
  if (status === "PAID") return "Ready for pickup"
  if (status === "ACTIVE") return "Active rental"
  if (status === "COMPLETED") return "Completed"
  if (status === "DECLINED") return "Declined"
  return "Cancelled"
}

export function requestCardAction(status: RentalStatus) {
  if (status === "REQUESTED") return "Review request"
  if (status === "PENDING_PAYMENT") return "See progress"
  if (status === "PAID") return "Open pickup"
  if (status === "ACTIVE") return "See rental progress"
  if (status === "COMPLETED") return "See details"
  return "See details"
}
