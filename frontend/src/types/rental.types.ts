export type RentalStatus =
  | "REQUESTED"
  | "PENDING_PAYMENT"
  | "PAID"
  | "ACTIVE"
  | "COMPLETED"
  | "DECLINED"
  | "CANCELLED"
export type PaymentGateway = "ESEWA" | "KHALTI"
export type EscrowStatus = "NONE" | "HELD" | "REFUNDED" | "FORFEITED" | "RELEASED"

export type Rental = {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  dailyRate: number
  deposit: number
  commitmentFee: number
  rentalTotal: number
  payLater: number
  days: number
  startDate: string
  endDate: string
  meetupLocation: string
  meetupLatitude: number | null
  meetupLongitude: number | null
  status: RentalStatus
  paymentGateway: PaymentGateway | null
  escrowStatus: EscrowStatus | null
  escrowNote: string | null
  myQrPayload: string | null
  meetupCode?: string | null
  meetupQrPayload?: string | null
  ownerId: string
  ownerName: string
  ownerAvatarUrl: string | null
  renterId: string
  renterName: string
  renterAvatarUrl: string | null
  owner: boolean
  renter: boolean
  renterNote?: string | null
  createdAt?: string
  canReview?: boolean
  myRating?: number | null
  myComment?: string | null
  renterRating?: number | null
  renterReviewCount?: number | null
  renterCompletedRentals?: number | null
  renterCity?: string | null
  returnMeetupLocation?: string | null
  returnMeetupLatitude?: number | null
  returnMeetupLongitude?: number | null
  returnMeetupAt?: string | null
  returnScheduled?: boolean
  myReturnQrPayload?: string | null
  commitmentApplied?: number | null
  platformCommission?: number | null
  ownerPayout?: number | null
}

export type PaymentConfig = {
  commitmentFee: number
  commissionPercent: number
  esewa: boolean
  khalti: boolean
}

export type PaymentInitiate = {
  gateway: PaymentGateway
  formAction: string | null
  formFields: Record<string, string>
  paymentUrl: string | null
}

export type SavedWallet = {
  id: string
  gateway: PaymentGateway
  label: string
  accountHint: string
  isDefault: boolean
}
