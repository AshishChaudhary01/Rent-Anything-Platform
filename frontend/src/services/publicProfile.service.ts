import { api } from "../config/api"

export type PublicProfileListing = {
  id: string
  title: string
  image: string
  dailyRate: number
  location: string
  status?: string
}

export type PublicProfile = {
  id: string
  fullName: string
  avatarUrl: string | null
  city: string | null
  district: string | null
  joinedAt: string | null
  averageRating: number
  reviewCount: number
  listingCount: number
  completedAsRenter: number
  completedAsOwner: number
  listings: PublicProfileListing[]
}

export type PublicReview = {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  authorId: string
  authorName: string
  authorAvatarUrl: string | null
  rating: number
  comment: string
  role: "OWNER" | "RENTER" | string
  createdAt: string
}

export type PublicReviewPage = {
  average: number
  count: number
  page: number
  size: number
  total: number
  items: PublicReview[]
}

export type PublicListingPage = {
  page: number
  size: number
  total: number
  items: PublicProfileListing[]
}

export const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const { data } = await api.get(`/account/profiles/${id}`)
  return data
}

export const fetchPublicReviews = async (
  id: string,
  params?: { page?: number; size?: number; rating?: number; role?: string; sort?: string },
): Promise<PublicReviewPage> => {
  const { data } = await api.get(`/account/profiles/${id}/reviews`, { params })
  return data
}

export const fetchPublicListings = async (
  id: string,
  params?: { page?: number; size?: number; status?: string; sort?: string },
): Promise<PublicListingPage> => {
  const { data } = await api.get(`/account/profiles/${id}/listings`, { params })
  return data
}
