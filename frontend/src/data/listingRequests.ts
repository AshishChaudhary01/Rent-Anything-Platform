import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../utils/images"

export type ListingRequestStatus = "Pending" | "Accepted" | "Declined"

export type ListingRequest = {
  id: number
  listing: string
  listingImage: string
  name: string
  time: string
  duration: string
  amount: string
  amountValue: number
  status: ListingRequestStatus
  pickup: string
  startDate: string
  endDate: string
  rate: string
  message: string
  rating: number
  reviews: number
  location: string
  memberSince: string
  completedRentals: number
  bio: string
}

const listings = [
  { listing: "Sony A7R IV Professional Kit", listingImage: tools01, rate: 999 },
  { listing: "North Face Tent", listingImage: tent01, rate: 600 },
  { listing: "MacBook Pro M1", listingImage: backpack01, rate: 1800 },
  { listing: "Canon EOS R5", listingImage: ladder01, rate: 2500 },
  { listing: "Pressure Washer", listingImage: pressureWasher01, rate: 700 },
]

const requesters = [
  { name: "Anish Shrestha", rating: 4.8, reviews: 32, location: "Lazimpat, Kathmandu", memberSince: "Jan 2023", completedRentals: 24, bio: "Photographer based in Kathmandu. I take good care of rented gear and return on time." },
  { name: "Sarah Maharjan", rating: 4.9, reviews: 18, location: "Patan, Lalitpur", memberSince: "Mar 2024", completedRentals: 11, bio: "Weekend traveler. I usually pick up in the morning and keep items in original condition." },
  { name: "Rohan Gurung", rating: 4.6, reviews: 21, location: "Lakeside, Pokhara", memberSince: "Aug 2022", completedRentals: 19, bio: "Adventure rider looking for reliable gear for short trips around Pokhara." },
  { name: "Ramesh Kumar", rating: 4.7, reviews: 40, location: "Baneshwor, Kathmandu", memberSince: "Nov 2021", completedRentals: 36, bio: "Regular RAP renter for camping and event equipment." },
  { name: "Sita Karki", rating: 4.5, reviews: 9, location: "Bhaktapur", memberSince: "Jun 2025", completedRentals: 6, bio: "Student filmmaker. I communicate clearly and follow pickup instructions." },
  { name: "Nabin Thapa", rating: 4.4, reviews: 14, location: "Kalanki, Kathmandu", memberSince: "Feb 2024", completedRentals: 8, bio: "DIY projects around the house. I treat tools like my own." },
]

const statuses: ListingRequestStatus[] = ["Pending", "Pending", "Accepted", "Pending", "Declined"]
const durations = [1, 2, 3, 4, 5]
const times = ["2 hrs ago", "1 day ago", "2 days ago", "3 days ago", "5 days ago", "1 week ago"]

export const listingRequests: ListingRequest[] = Array.from({ length: 24 }, (_, i) => {
  const listing = listings[i % listings.length]
  const person = requesters[i % requesters.length]
  const days = durations[i % durations.length]
  const amountValue = listing.rate * days
  const status = statuses[i % statuses.length]
  return {
    id: i + 1,
    listing: listing.listing,
    listingImage: listing.listingImage,
    name: person.name,
    time: times[i % times.length],
    duration: `${days} Day${days > 1 ? "s" : ""}`,
    amount: `NPR ${amountValue.toLocaleString()}`,
    amountValue,
    status,
    pickup: person.location,
    startDate: "Oct 24",
    endDate: "Oct 27",
    rate: `NPR ${listing.rate.toLocaleString()}`,
    message: `Hi, I would like to rent your ${listing.listing} for ${days} day${days > 1 ? "s" : ""}. Pickup in ${person.location} works for me.`,
    rating: person.rating,
    reviews: person.reviews,
    location: person.location,
    memberSince: person.memberSince,
    completedRentals: person.completedRentals,
    bio: person.bio,
  }
})

export function getListingRequest(id: number) {
  return listingRequests.find((req) => req.id === id)
}
