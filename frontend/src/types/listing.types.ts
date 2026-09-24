export type ListingMedia = {
  url: string
  type: "image" | "video" | string
}

export type Listing = {
  id: string
  title: string
  description: string
  category: string
  dailyRate: number
  deposit: number
  location: string
  latitude: number | null
  longitude: number | null
  status: "AVAILABLE" | "UNAVAILABLE" | "RENTED" | "REMOVED"
  ownerId: string
  ownerName: string
  owner: boolean
  media: ListingMedia[]
  createdAt: string
  updatedAt: string
  activity?: {
    startDate: string
    endDate: string
    status: string
  }[]
  activeBooking?: {
    rentalId: string
    renterName: string
    renterId: string
    startDate: string
    endDate: string
    status: string
    meetupLocation: string
  } | null
}

export type ListingPage = {
  items: Listing[]
  total: number
  page: number
  size: number
}

export type ListingCard = {
  id: string
  title: string
  rate: number
  unit: string
  location: string
  image: string
  category: string
  createdAt?: string
  status?: Listing["status"]
}

export function listingCover(listing: Listing) {
  const photo = listing.media.find((item) => {
    const type = (item.type || "").toLowerCase()
    return type === "image" || type === "img" || type.startsWith("image/")
  })
  if (photo?.url) return photo.url
  const first = listing.media[0]
  const url = first?.url || ""
  if (url.includes("/video/upload/")) {
    return url.replace("/video/upload/", "/video/upload/so_0,f_jpg/")
  }
  return url
}

export function listingOccupancy(listing: Listing) {
  const booking = listing.activeBooking
  if (listing.status === "RENTED" || booking?.status === "ACTIVE") {
    return {
      key: "active" as const,
      label: "Actively rented",
      detail: booking ? `${booking.startDate} – ${booking.endDate}` : "Currently on rental",
      renterName: booking?.renterName,
    }
  }
  if (booking) {
    return {
      key: "busy" as const,
      label: "Busy",
      detail: `${booking.startDate} – ${booking.endDate}`,
      renterName: booking.renterName,
    }
  }
  if (listing.status === "UNAVAILABLE") {
    return { key: "paused" as const, label: "Unavailable", detail: "Paused by you", renterName: undefined }
  }
  return { key: "open" as const, label: "Available", detail: "Open for requests", renterName: undefined }
}

export function toListingCard(listing: Listing): ListingCard {
  return {
    id: listing.id,
    title: listing.title,
    rate: Number(listing.dailyRate),
    unit: "day",
    location: listing.location,
    image: listingCover(listing),
    category: listing.category,
    createdAt: listing.createdAt,
    status: listing.status,
  }
}
