import { api } from "../config/api"

export type AdminOverview = {
  users: number
  listings: number
  rentals: number
  pendingReports: number
  pendingKyc: number
  platformFee: number
  gmv: number
  commissionPercent: number
  commitmentFee: number
  kycRequired: boolean
}

export type AdminUser = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  kycStatus: string
  kycRaw: string
  avatarUrl: string
  addressLine: string
  city: string
  district: string
  location: string
  joined: string
  joinedAt: string
  kycFullName: string
  kycDateOfBirth: string
  kycDocumentType: string
  kycDocumentNumber: string
  kycFrontUrl: string
  kycBackUrl: string
  kycNotes: string
}

export type AdminListing = {
  id: string
  title: string
  description: string
  category: string
  location: string
  rate: number
  deposit: number
  status: string
  image: string
  ownerId: string
  ownerName: string
  createdAt: string
}

export type AdminRental = {
  id: string
  listingId: string
  listingTitle: string
  image: string
  ownerId: string
  ownerName: string
  renterId: string
  renterName: string
  startDate: string
  endDate: string
  status: string
  amount: number
  platformFee: number
  createdAt: string
}

export type AdminReport = {
  id: string
  context: string
  reason: string
  detail: string
  listingTitle: string
  listingId: string | null
  reporterName: string
  reporterId: string | null
  accusedName: string
  accusedId: string | null
  rentalId: string | null
  proofs: string[]
  status: string
  resolutionAction: string | null
  resolutionNotes: string | null
  resolverId: string | null
  resolverName: string | null
  resolverRole: string | null
  resolverEmail: string | null
  resolvedAt: string | null
  createdAt: string
  opened: string
  openedAt: string
}

function money(value: unknown) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function text(value: unknown) {
  return value == null ? "" : String(value)
}

function prettyDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function prettyKyc(status: string) {
  if (status === "VERIFIED") return "Verified"
  if (status === "PENDING") return "Pending"
  if (status === "REJECTED") return "Rejected"
  return "Not started"
}

export function prettyListingStatus(status: string) {
  if (status === "AVAILABLE" || status === "RENTED") return "Active"
  if (status === "UNAVAILABLE") return "Disabled"
  if (status === "REMOVED") return "Removed"
  return status
}

export function prettyRentalStatus(status: string) {
  if (status === "ACTIVE") return "Active"
  if (status === "COMPLETED") return "Completed"
  if (status === "CANCELLED" || status === "DECLINED") return "Cancelled"
  if (status === "REQUESTED" || status === "PENDING_PAYMENT" || status === "PAID" || status === "MEETUP_CONFIRMED") return "Pending"
  return status
}

export function prettyReportStatus(status: string) {
  return status === "RESOLVED" ? "Resolved" : "Pending"
}

function mapUser(raw: Record<string, unknown>): AdminUser {
  const city = text(raw.city)
  const district = text(raw.district)
  const createdAt = text(raw.createdAt)
  return {
    id: text(raw.id),
    fullName: text(raw.fullName),
    email: text(raw.email),
    phone: text(raw.phone),
    role: text(raw.role),
    status: text(raw.status) || "Active",
    kycRaw: text(raw.kycStatus),
    kycStatus: prettyKyc(text(raw.kycStatus)),
    avatarUrl: text(raw.avatarUrl),
    addressLine: text(raw.addressLine),
    city,
    district,
    location: [city, district].filter(Boolean).join(", "),
    joined: prettyDate(createdAt),
    joinedAt: createdAt.slice(0, 10),
    kycFullName: text(raw.kycFullName),
    kycDateOfBirth: text(raw.kycDateOfBirth),
    kycDocumentType: text(raw.kycDocumentType),
    kycDocumentNumber: text(raw.kycDocumentNumber),
    kycFrontUrl: text(raw.kycFrontUrl),
    kycBackUrl: text(raw.kycBackUrl),
    kycNotes: text(raw.kycNotes),
  }
}

function mapListing(raw: Record<string, unknown>): AdminListing {
  return {
    id: text(raw.id),
    title: text(raw.title),
    description: text(raw.description),
    category: text(raw.category),
    location: text(raw.location),
    rate: money(raw.dailyRate),
    deposit: money(raw.deposit),
    status: prettyListingStatus(text(raw.status)),
    image: text(raw.image),
    ownerId: text(raw.ownerId),
    ownerName: text(raw.ownerName),
    createdAt: text(raw.createdAt).slice(0, 10),
  }
}

function mapRental(raw: Record<string, unknown>): AdminRental {
  return {
    id: text(raw.id),
    listingId: text(raw.listingId),
    listingTitle: text(raw.listingTitle),
    image: text(raw.image),
    ownerId: text(raw.ownerId),
    ownerName: text(raw.ownerName),
    renterId: text(raw.renterId),
    renterName: text(raw.renterName),
    startDate: text(raw.startDate),
    endDate: text(raw.endDate),
    status: prettyRentalStatus(text(raw.status)),
    amount: money(raw.amount),
    platformFee: money(raw.platformFee),
    createdAt: text(raw.createdAt),
  }
}

function mapReport(raw: Record<string, unknown>): AdminReport {
  const createdAt = text(raw.createdAt)
  return {
    id: text(raw.id),
    context: text(raw.context),
    reason: text(raw.reason),
    detail: text(raw.detail),
    listingTitle: text(raw.listingTitle),
    listingId: raw.listingId ? text(raw.listingId) : null,
    reporterName: text(raw.reporterName),
    reporterId: raw.reporterId ? text(raw.reporterId) : null,
    accusedName: text(raw.accusedName),
    accusedId: raw.accusedId ? text(raw.accusedId) : null,
    rentalId: raw.rentalId ? text(raw.rentalId) : null,
    proofs: Array.isArray(raw.proofs) ? raw.proofs.map((item) => String(item)) : [],
    status: prettyReportStatus(text(raw.status)),
    resolutionAction: raw.resolutionAction ? text(raw.resolutionAction) : null,
    resolutionNotes: raw.resolutionNotes ? text(raw.resolutionNotes) : null,
    resolverId: raw.resolverId ? text(raw.resolverId) : null,
    resolverName: raw.resolverName ? text(raw.resolverName) : null,
    resolverRole: raw.resolverRole ? text(raw.resolverRole) : null,
    resolverEmail: raw.resolverEmail ? text(raw.resolverEmail) : null,
    resolvedAt: raw.resolvedAt ? text(raw.resolvedAt) : null,
    createdAt,
    opened: prettyDate(createdAt),
    openedAt: createdAt.slice(0, 10),
  }
}

export const fetchAdminOverview = async (): Promise<AdminOverview> => {
  const { data } = await api.get("/admin/overview")
  return {
    users: money(data.users),
    listings: money(data.listings),
    rentals: money(data.rentals),
    pendingReports: money(data.pendingReports),
    pendingKyc: money(data.pendingKyc),
    platformFee: money(data.platformFee),
    gmv: money(data.gmv),
    commissionPercent: money(data.commissionPercent),
    commitmentFee: money(data.commitmentFee),
    kycRequired: Boolean(data.kycRequired),
  }
}

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/admin/users")
  return (data as Record<string, unknown>[]).map(mapUser)
}

export const fetchAdminUser = async (id: string): Promise<AdminUser> => {
  const { data } = await api.get(`/admin/users/${id}`)
  return mapUser(data)
}

export const setAdminUserStatus = async (id: string, status: string): Promise<AdminUser> => {
  const { data } = await api.post(`/admin/users/${id}/status`, { status })
  return mapUser(data)
}

export const fetchAdminListings = async (): Promise<AdminListing[]> => {
  const { data } = await api.get("/admin/listings")
  return (data as Record<string, unknown>[]).map(mapListing)
}

export const fetchAdminListing = async (id: string): Promise<AdminListing> => {
  const { data } = await api.get(`/admin/listings/${id}`)
  return mapListing(data)
}

export const setAdminListingStatus = async (id: string, status: string): Promise<AdminListing> => {
  const { data } = await api.post(`/admin/listings/${id}/status`, { status })
  return mapListing(data)
}

export const fetchAdminKyc = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/admin/kyc")
  return (data as Record<string, unknown>[]).map(mapUser)
}

export const fetchAdminKycCase = async (id: string): Promise<AdminUser> => {
  const { data } = await api.get(`/admin/kyc/${id}`)
  return mapUser(data)
}

export const reviewAdminKyc = async (id: string, approved: boolean, notes: string): Promise<AdminUser> => {
  const { data } = await api.post(`/admin/kyc/${id}/review`, { approved, notes })
  return mapUser(data)
}

export const fetchAdminReports = async (): Promise<AdminReport[]> => {
  const { data } = await api.get("/admin/reports")
  return (data as Record<string, unknown>[]).map(mapReport)
}

export const fetchAdminReport = async (id: string): Promise<AdminReport> => {
  const { data } = await api.get(`/admin/reports/${id}`)
  return mapReport(data)
}

export const resolveAdminReport = async (id: string, action: string, notes: string): Promise<AdminReport> => {
  const { data } = await api.post(`/admin/reports/${id}/resolve`, { action, notes })
  return mapReport(data)
}

export const fetchAdminRentals = async (): Promise<AdminRental[]> => {
  const { data } = await api.get("/admin/rentals")
  return (data as Record<string, unknown>[]).map(mapRental)
}

export const fetchAdminRental = async (id: string): Promise<AdminRental> => {
  const { data } = await api.get(`/admin/rentals/${id}`)
  return mapRental(data)
}

export const createAdminAccount = async (payload: {
  fullName: string
  email: string
  password: string
  phone?: string
}): Promise<AdminUser> => {
  const { data } = await api.post("/admin/staff", payload)
  return mapUser(data)
}

export const fetchAdminStaff = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/admin/staff")
  return (data as Record<string, unknown>[]).map(mapUser)
}

export const fetchAdminStaffMember = async (id: string): Promise<AdminUser> => {
  const { data } = await api.get(`/admin/staff/${id}`)
  return mapUser(data)
}

export const updateAdminAccount = async (
  id: string,
  payload: { fullName: string; email: string; password?: string; phone?: string },
): Promise<AdminUser> => {
  const { data } = await api.put(`/admin/staff/${id}`, payload)
  return mapUser(data)
}

export const setAdminStaffStatus = async (id: string, status: string): Promise<AdminUser> => {
  const { data } = await api.post(`/admin/staff/${id}/status`, { status })
  return mapUser(data)
}

export const deleteAdminAccount = async (id: string): Promise<void> => {
  await api.delete(`/admin/staff/${id}`)
}
