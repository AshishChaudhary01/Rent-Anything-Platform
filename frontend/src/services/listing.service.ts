import { api } from "../config/api"
import type { Listing, ListingPage } from "../types/listing.types"

export const fetchListings = async (params?: {
  category?: string
  q?: string
  sort?: string
  page?: number
  size?: number
}): Promise<ListingPage> => {
  const { data } = await api.get("/listings", { params })
  return data
}

export const fetchMyListings = async (): Promise<Listing[]> => {
  const { data } = await api.get("/listings/mine")
  return data
}

export const fetchListing = async (id: string): Promise<Listing> => {
  const { data } = await api.get(`/listings/${id}`)
  return data
}

export const createListing = async (payload: {
  title: string
  category: string
  description: string
  dailyRate: string | number
  deposit: string | number
  location: string
  latitude?: number
  longitude?: number
  files: File[]
}): Promise<Listing> => {
  const body = new FormData()
  body.append("title", payload.title)
  body.append("category", payload.category)
  body.append("description", payload.description)
  body.append("dailyRate", String(payload.dailyRate))
  body.append("deposit", String(payload.deposit || 0))
  body.append("location", payload.location)
  if (payload.latitude != null) body.append("latitude", String(payload.latitude))
  if (payload.longitude != null) body.append("longitude", String(payload.longitude))
  payload.files.forEach((file) => body.append("files", file))
  const { data } = await api.post("/listings", body)
  return data
}

export const updateListing = async (
  id: string,
  payload: {
    title: string
    description: string
    dailyRate: string | number
    deposit: string | number
    location: string
    latitude?: number | null
    longitude?: number | null
    status?: string
    keepUrls: string[]
    files: File[]
  },
): Promise<Listing> => {
  const body = new FormData()
  body.append("title", payload.title)
  body.append("description", payload.description)
  body.append("dailyRate", String(payload.dailyRate))
  body.append("deposit", String(payload.deposit || 0))
  body.append("location", payload.location)
  if (payload.latitude != null) body.append("latitude", String(payload.latitude))
  if (payload.longitude != null) body.append("longitude", String(payload.longitude))
  if (payload.status) body.append("status", payload.status)
  payload.keepUrls.forEach((url) => body.append("keepUrls", url))
  payload.files.forEach((file) => body.append("files", file))
  const { data } = await api.patch(`/listings/${id}`, body)
  return data
}
