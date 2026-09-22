import { catalog } from "./catalog"
import { backpack01, ladder01, profile01, tent01, tools01 } from "../utils/images"

export type AdminRole = "USER" | "ADMIN" | "SUPER_ADMIN"
export type UserStatus = "Active" | "Suspended" | "Banned"
export type ListingStatus = "Active" | "Disabled" | "Removed"
export type RentalStatus = "Active" | "Completed" | "Cancelled" | "Failed"
export type ReportStatus = "Pending" | "Resolved"
export type KycCaseStatus = "Pending" | "Verified" | "Rejected"

export type AdminUser = {
  id: string
  fullName: string
  email: string
  phone: string
  role: AdminRole
  status: UserStatus
  joined: string
  joinedAt: string
  location: string
  addressLine: string
  city: string
  district: string
  bio: string
  kycStatus: KycCaseStatus | "Not submitted"
  listings: number
  rentals: number
}

export type AdminListing = {
  id: number
  title: string
  description: string
  ownerId: string
  ownerName: string
  rate: number
  deposit: number
  location: string
  category: string
  image: string
  gallery: string[]
  status: ListingStatus
  condition: string
  createdAt: string
}

export type AdminRental = {
  id: string
  listingId: number
  listingTitle: string
  image: string
  ownerId: string
  ownerName: string
  renterId: string
  renterName: string
  startDate: string
  endDate: string
  amount: number
  platformFee: number
  status: RentalStatus
}

export type ReportProof = { type: "image" | "video"; url: string; label: string }

export type ReportResolution = {
  resolverId: string
  resolverName: string
  action: string
  notes: string
  closedAt: string
}

export type AdminReport = {
  id: string
  listingId: number
  listingTitle: string
  reporterId: string
  reporterName: string
  accusedId: string
  accusedName: string
  rentalId: string | null
  reason: string
  detail: string
  status: ReportStatus
  opened: string
  openedAt: string
  proofs: ReportProof[]
  resolution: ReportResolution | null
}

export type AdminKycCase = {
  id: string
  userId: string
  userName: string
  status: KycCaseStatus
  fullName: string
  dateOfBirth: string
  docType: string
  docNumber: string
  frontImage: string
  backImage: string
  submitted: string
  submittedAt: string
  reviewer?: string
  notes?: string
}

export type PlatformSettings = {
  platformFeePercent: number
  commitmentFeeNrs: number
  minRentalDays: number
  maxRentalDays: number
  requireKycToList: boolean
  requireKycToRent: boolean
}

export const demoAdminAccounts = [
  { email: "superadmin@rap.np", password: "rapadmin1", role: "SUPER_ADMIN" as const, userId: "admin-super" },
  { email: "admin@rap.np", password: "rapadmin1", role: "ADMIN" as const, userId: "admin-staff" },
]

const names = [
  { id: "u-ram", fullName: "Ram Rai", email: "ramrai@gmail.com", phone: "9801234567", location: "Lazimpat, Kathmandu", city: "Kathmandu", district: "Kathmandu" },
  { id: "u-anish", fullName: "Anish Sharma", email: "anish@rap.np", phone: "9811111111", location: "Baneshwor, Kathmandu", city: "Kathmandu", district: "Kathmandu" },
  { id: "u-arpan", fullName: "Arpan Sharma", email: "arpan@rap.np", phone: "9822222222", location: "Patan, Lalitpur", city: "Lalitpur", district: "Lalitpur" },
  { id: "u-ramesh", fullName: "Ramesh Kumar", email: "ramesh@rap.np", phone: "9833333333", location: "Bhaktapur", city: "Bhaktapur", district: "Bhaktapur" },
  { id: "u-sita", fullName: "Sita Thapa", email: "sita@rap.np", phone: "9844444444", location: "Lakeside, Pokhara", city: "Pokhara", district: "Kaski" },
  { id: "u-bina", fullName: "Bina Gurung", email: "bina@rap.np", phone: "9855555555", location: "Kalimati, Kathmandu", city: "Kathmandu", district: "Kathmandu" },
  { id: "u-kiran", fullName: "Kiran Magar", email: "kiran@rap.np", phone: "9866666666", location: "Koteshwor, Kathmandu", city: "Kathmandu", district: "Kathmandu" },
  { id: "u-nabin", fullName: "Nabin Shrestha", email: "nabin@rap.np", phone: "9877777777", location: "Thankot", city: "Kathmandu", district: "Kathmandu" },
  { id: "u-maya", fullName: "Maya Rai", email: "maya@rap.np", phone: "9888888888", location: "Dharan", city: "Dharan", district: "Sunsari" },
  { id: "u-prakash", fullName: "Prakash Adhikari", email: "prakash@rap.np", phone: "9899999999", location: "Butwal", city: "Butwal", district: "Rupandehi" },
]

const kycByIndex = (i: number): AdminUser["kycStatus"] => {
  if (i === 7) return "Pending"
  if (i === 8) return "Rejected"
  if (i % 3 === 0) return "Not submitted"
  return "Verified"
}

function isoAgo(days: number) {
  const d = new Date("2026-09-22T12:00:00")
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

const userJoinedDays = [1, 4, 12, 22, 40, 75, 110, 160, 220, 400]

export const initialAdminUsers: AdminUser[] = [
  ...names.map((u, i) => ({
    ...u,
    addressLine: `House ${10 + i}, ${u.location.split(",")[0]}`,
    bio: i % 2 === 0 ? "Lists cameras and outdoor gear on RAP." : "Rents tools and electronics for short trips.",
    role: "USER" as const,
    status: (i === 7 ? "Suspended" : i === 8 ? "Banned" : "Active") as UserStatus,
    joined: i % 2 === 0 ? "Jan 2024" : "Aug 2023",
    joinedAt: isoAgo(userJoinedDays[i] ?? 90),
    kycStatus: kycByIndex(i),
    listings: 2 + (i % 5),
    rentals: 1 + (i % 8),
  })),
  {
    id: "admin-super",
    fullName: "RAP Super Admin",
    email: "superadmin@rap.np",
    phone: "9800000001",
    role: "SUPER_ADMIN",
    status: "Active",
    joined: "Jan 2023",
    joinedAt: "2023-01-10",
    location: "Kathmandu",
    addressLine: "RAP HQ, New Baneshwor",
    city: "Kathmandu",
    district: "Kathmandu",
    bio: "Platform super administrator.",
    kycStatus: "Verified",
    listings: 0,
    rentals: 0,
  },
  {
    id: "admin-staff",
    fullName: "RAP Admin",
    email: "admin@rap.np",
    phone: "9800000002",
    role: "ADMIN",
    status: "Active",
    joined: "Mar 2024",
    joinedAt: "2024-03-12",
    location: "Kathmandu",
    addressLine: "RAP HQ, New Baneshwor",
    city: "Kathmandu",
    district: "Kathmandu",
    bio: "Trust and safety administrator.",
    kycStatus: "Verified",
    listings: 0,
    rentals: 0,
  },
]

const listingStatuses: ListingStatus[] = ["Active", "Active", "Active", "Disabled", "Removed"]

export const initialAdminListings: AdminListing[] = catalog.slice(0, 36).map((item, i) => {
  const owner = names[i % names.length]
  return {
    id: item.id,
    title: item.title,
    description: `${item.title} listed for peer-to-peer rental. Pickup in ${item.location}. Includes standard accessories unless noted in chat.`,
    ownerId: owner.id,
    ownerName: owner.fullName,
    rate: item.rate,
    deposit: item.rate * 8,
    location: item.location,
    category: item.category,
    image: item.image,
    gallery: [item.image, tools01, tent01, backpack01, ladder01],
    status: listingStatuses[i % listingStatuses.length],
    condition: i % 4 === 0 ? "Like new" : "Good",
    createdAt: isoAgo((i % 12) * 8 + (i % 5)),
  }
})

const rentalStatuses: RentalStatus[] = ["Active", "Active", "Completed", "Cancelled", "Failed", "Completed"]
const rentalStarts = [
  "2026-09-22", "2026-09-22", "2026-09-21", "2026-09-19",
  "2026-09-14", "2026-09-08", "2026-09-02", "2026-08-26",
  "2026-08-18", "2026-08-10", "2026-08-01", "2026-07-20",
  "2026-07-08", "2026-06-25", "2026-06-12", "2026-06-01",
  "2026-05-18", "2026-05-04", "2026-04-20", "2026-04-06",
  "2026-03-22", "2026-03-05", "2026-02-14", "2026-01-18",
]

export const initialAdminRentals: AdminRental[] = catalog.slice(0, 24).map((item, i) => {
  const owner = names[i % names.length]
  const renter = names[(i + 3) % names.length]
  const amount = item.rate * 3 + 200
  const startDate = rentalStarts[i] ?? isoAgo(i * 10)
  const end = new Date(`${startDate}T12:00:00`)
  end.setDate(end.getDate() + 3 + (i % 5))
  return {
    id: `RA-${88000 + i}`,
    listingId: item.id,
    listingTitle: item.title,
    image: item.image,
    ownerId: owner.id,
    ownerName: owner.fullName,
    renterId: renter.id,
    renterName: renter.fullName,
    startDate,
    endDate: end.toISOString().slice(0, 10),
    amount,
    platformFee: Math.round(amount * 0.08),
    status: rentalStatuses[i % rentalStatuses.length],
  }
})

export const initialAdminReports: AdminReport[] = [
  {
    id: "RP-104",
    listingId: initialAdminListings[0].id,
    listingTitle: initialAdminListings[0].title,
    reporterId: "u-ram",
    reporterName: "Ram Rai",
    accusedId: "u-anish",
    accusedName: "Anish Sharma",
    rentalId: "RA-88000",
    reason: "Item not as described",
    detail: "The kit was missing a battery at pickup. Owner refused to adjust the rate.",
    status: "Pending",
    opened: "2h ago",
    openedAt: "2026-09-22",
    proofs: [
      { type: "image", url: tools01, label: "Pickup photo" },
      { type: "image", url: backpack01, label: "Empty battery slot" },
    ],
    resolution: null,
  },
  {
    id: "RP-105",
    listingId: initialAdminListings[4].id,
    listingTitle: initialAdminListings[4].title,
    reporterId: "u-sita",
    reporterName: "Sita Thapa",
    accusedId: "u-nabin",
    accusedName: "Nabin Shrestha",
    rentalId: "RA-88004",
    reason: "No-show at meetup",
    detail: "Renter did not arrive and stopped replying.",
    status: "Pending",
    opened: "1d ago",
    openedAt: "2026-09-21",
    proofs: [{ type: "image", url: tent01, label: "Meetup location" }],
    resolution: null,
  },
  {
    id: "RP-106",
    listingId: initialAdminListings[8].id,
    listingTitle: initialAdminListings[8].title,
    reporterId: "u-arpan",
    reporterName: "Arpan Sharma",
    accusedId: "u-maya",
    accusedName: "Maya Rai",
    rentalId: null,
    reason: "Listing policy violation",
    detail: "Photos appear reused from another marketplace listing.",
    status: "Pending",
    opened: "3d ago",
    openedAt: "2026-09-19",
    proofs: [
      { type: "image", url: tools01, label: "Reported listing photo" },
      { type: "video", url: ladder01, label: "Listing video clip" },
    ],
    resolution: null,
  },
  {
    id: "RP-101",
    listingId: initialAdminListings[2].id,
    listingTitle: initialAdminListings[2].title,
    reporterId: "u-bina",
    reporterName: "Bina Gurung",
    accusedId: "u-kiran",
    accusedName: "Kiran Magar",
    rentalId: "RA-88002",
    reason: "Late return",
    detail: "Returned two days late. Deposit already handled.",
    status: "Resolved",
    opened: "2w ago",
    openedAt: "2026-09-08",
    proofs: [{ type: "image", url: tent01, label: "Return timestamp" }],
    resolution: {
      resolverId: "admin-staff",
      resolverName: "RAP Admin",
      action: "Warning issued",
      notes: "Late fee applied. Both parties accepted.",
      closedAt: "8 Sep 2026",
    },
  },
  {
    id: "RP-102",
    listingId: initialAdminListings[12].id,
    listingTitle: initialAdminListings[12].title,
    reporterId: "u-prakash",
    reporterName: "Prakash Adhikari",
    accusedId: "u-ramesh",
    accusedName: "Ramesh Kumar",
    rentalId: "RA-88006",
    reason: "Damage dispute",
    detail: "Scratch on the body. Both sides agreed on a small deduction.",
    status: "Resolved",
    opened: "3w ago",
    openedAt: "2026-09-01",
    proofs: [
      { type: "image", url: backpack01, label: "Scratch close-up" },
      { type: "image", url: tools01, label: "Pre-rental photo" },
    ],
    resolution: {
      resolverId: "admin-super",
      resolverName: "RAP Super Admin",
      action: "Partial deposit withheld",
      notes: "Nrs. 1,200 deducted. Case closed.",
      closedAt: "1 Sep 2026",
    },
  },
]

export const initialAdminKyc: AdminKycCase[] = [
  {
    id: "KYC-221",
    userId: "u-nabin",
    userName: "Nabin Shrestha",
    status: "Pending",
    fullName: "Nabin Shrestha",
    dateOfBirth: "1996-04-12",
    docType: "Citizenship",
    docNumber: "12-01-78-01921",
    frontImage: profile01,
    backImage: tools01,
    submitted: "Today",
    submittedAt: "2026-09-22",
  },
  {
    id: "KYC-218",
    userId: "u-anish",
    userName: "Anish Sharma",
    status: "Pending",
    fullName: "Anish Sharma",
    dateOfBirth: "1994-11-02",
    docType: "National ID",
    docNumber: "NID-88421",
    frontImage: profile01,
    backImage: tent01,
    submitted: "Yesterday",
    submittedAt: "2026-09-21",
  },
  {
    id: "KYC-190",
    userId: "u-ram",
    userName: "Ram Rai",
    status: "Verified",
    fullName: "Ram Rai",
    dateOfBirth: "1998-01-20",
    docType: "Citizenship",
    docNumber: "12-01-78-01234",
    frontImage: profile01,
    backImage: backpack01,
    submitted: "12 Aug 2026",
    submittedAt: "2026-08-12",
    reviewer: "RAP Admin",
    notes: "Document matches profile name.",
  },
  {
    id: "KYC-177",
    userId: "u-maya",
    userName: "Maya Rai",
    status: "Rejected",
    fullName: "Maya Rai",
    dateOfBirth: "2001-07-09",
    docType: "Passport",
    docNumber: "PA-102938",
    frontImage: profile01,
    backImage: tent01,
    submitted: "02 Aug 2026",
    submittedAt: "2026-08-02",
    reviewer: "RAP Super Admin",
    notes: "Photo too blurry. Ask user to resubmit.",
  },
]

export const initialPlatformSettings: PlatformSettings = {
  platformFeePercent: 8,
  commitmentFeeNrs: 100,
  minRentalDays: 1,
  maxRentalDays: 30,
  requireKycToList: true,
  requireKycToRent: false,
}

export const monthlyRevenue = [
  { month: "Apr", amount: 18400 },
  { month: "May", amount: 22100 },
  { month: "Jun", amount: 19850 },
  { month: "Jul", amount: 25600 },
  { month: "Aug", amount: 24320 },
  { month: "Sep", amount: 28140 },
]
