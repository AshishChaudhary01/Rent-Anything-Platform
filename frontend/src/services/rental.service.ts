import { api } from "../config/api"
import type {
  PaymentConfig,
  PaymentGateway,
  PaymentInitiate,
  Rental,
  SavedWallet,
} from "../types/rental.types"

export const fetchPaymentConfig = async (): Promise<PaymentConfig> => {
  const { data } = await api.get("/rentals/payment-config")
  return data
}

export const fetchMyRentals = async (): Promise<Rental[]> => {
  const { data } = await api.get("/rentals/mine")
  return data
}

export const fetchRental = async (id: string): Promise<Rental> => {
  const { data } = await api.get(`/rentals/${id}`)
  return data
}

export const fetchOwnedRentals = async (): Promise<Rental[]> => {
  const { data } = await api.get("/rentals/owned")
  return data
}

export const createRental = async (payload: {
  listingId: string
  startDate: string
  endDate: string
  meetupLocation: string
  meetupLatitude?: number
  meetupLongitude?: number
  note?: string
}): Promise<Rental> => {
  const { data } = await api.post("/rentals", payload)
  return data
}

export const initiatePayment = async (
  id: string,
  payload: { gateway: PaymentGateway },
): Promise<PaymentInitiate> => {
  const { data } = await api.post(`/rentals/${id}/payments`, payload)
  return data
}

export const verifyEsewaPayment = async (id: string, encodedData: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/payments/esewa/verify`, { data: encodedData })
  return data
}

export const verifyKhaltiPayment = async (id: string, pidx: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/payments/khalti/verify`, { pidx })
  return data
}

export const startRental = async (id: string, code: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/start`, { code })
  return data
}

export const scheduleReturn = async (
  id: string,
  payload: { date: string; time: string; location: string; latitude?: number; longitude?: number },
): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/return-schedule`, payload)
  return data
}

export const finishReturn = async (id: string, code: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/return`, { code })
  return data
}

export const reportNoShow = async (id: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/no-show`)
  return data
}

export const cancelRental = async (id: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/cancel`)
  return data
}

export const acceptRental = async (id: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/accept`)
  return data
}

export const declineRental = async (id: string): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/decline`)
  return data
}

export const submitRentalReview = async (id: string, payload: { rating: number; comment?: string }): Promise<Rental> => {
  const { data } = await api.post(`/rentals/${id}/reviews`, payload)
  return data
}

export type ListingReview = {
  id: string
  listingId: string
  rentalId: string
  authorId?: string
  authorName: string
  authorAvatarUrl: string | null
  rating: number
  comment: string
  createdAt: string
  mine?: boolean
}

export type ListingReviews = {
  average: number
  count: number
  items: ListingReview[]
}

export const fetchListingReviews = async (listingId: string): Promise<ListingReviews> => {
  const { data } = await api.get(`/listings/${listingId}/reviews`)
  return data
}

export const fetchWallets = async (): Promise<SavedWallet[]> => {
  const { data } = await api.get("/account/wallets")
  return data
}

export const saveWallet = async (payload: {
  gateway: PaymentGateway
  phone: string
}): Promise<SavedWallet> => {
  const { data } = await api.post("/account/wallets", payload)
  return data
}

export const setDefaultWallet = async (id: string): Promise<SavedWallet> => {
  const { data } = await api.patch(`/account/wallets/${id}/default`)
  return data
}

export const deleteWallet = async (id: string): Promise<void> => {
  await api.delete(`/account/wallets/${id}`)
}

export function submitEsewaForm(action: string, fields: Record<string, string>) {
  const form = document.createElement("form")
  form.method = "POST"
  form.action = action
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = name
    input.value = value
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}

export async function downloadReceipt(id: string, kind: "COMMITMENT" | "RENT" = "COMMITMENT") {
  const { data } = await api.get(`/rentals/${id}/receipt`, {
    params: { kind },
    responseType: "blob",
  })
  const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `rap-receipt-${kind.toLowerCase()}-${id.slice(0, 8)}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
