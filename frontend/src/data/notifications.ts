import { backpack01, profile01, tent01, tools01 } from "../utils/images"

export type AppNotification = {
  id: number
  message: string
  time: string
  read: boolean
  image: string
  path: string
  kind: "message" | "booking" | "rental" | "pickup" | "request" | "return" | "payment"
}

export const NOTIFICATION_PAGE_SIZE = 6

export const initialNotifications: AppNotification[] = [
  { id: 1, message: "Your booking request was approved.", time: "2m ago", read: false, image: tools01, path: "/user/rental-details", kind: "booking" },
  { id: 2, message: "New message from Anish Sharma.", time: "1h ago", read: false, image: profile01, path: "/user/chat?thread=anish-sony", kind: "message" },
  { id: 3, message: "Rental period ends tomorrow.", time: "3h ago", read: true, image: tent01, path: "/user/rental-details", kind: "rental" },
  { id: 4, message: "Pickup meetup confirmed for Oct 24, 10:30 AM.", time: "Yesterday", read: true, image: tools01, path: "/user/rental-details", kind: "pickup" },
  { id: 5, message: "A renter requested your Sony A7R IV Kit.", time: "Yesterday", read: true, image: tools01, path: "/user/listing-requests", kind: "request" },
  { id: 6, message: "Return QR was scanned. Rental complete.", time: "2d ago", read: true, image: backpack01, path: "/user/my-listings", kind: "return" },
  { id: 7, message: "Security deposit will be released after review.", time: "3d ago", read: true, image: tools01, path: "/user/my-listings", kind: "payment" },
  { id: 8, message: "New message from Arpan Sharma.", time: "3d ago", read: true, image: profile01, path: "/user/chat?thread=arpan-sony", kind: "message" },
  { id: 9, message: "Your North Face Tent listing got a new request.", time: "4d ago", read: true, image: tent01, path: "/user/listing-requests", kind: "request" },
  { id: 10, message: "Return meetup is scheduled for tomorrow.", time: "4d ago", read: true, image: tent01, path: "/user/rent/return-schedule", kind: "return" },
  { id: 11, message: "Payment of Nrs. 100 commitment fee succeeded.", time: "5d ago", read: true, image: tools01, path: "/user/rent/confirmation", kind: "payment" },
  { id: 12, message: "PS5 Console rental starts today. Ready for pickup.", time: "5d ago", read: true, image: backpack01, path: "/user/my-rentals", kind: "pickup" },
  { id: 13, message: "A renter declined the meetup time. Check chat.", time: "6d ago", read: true, image: profile01, path: "/user/chat", kind: "message" },
  { id: 14, message: "Your listing Canon EOS R5 is now rented.", time: "1w ago", read: true, image: tools01, path: "/user/my-listing-details", kind: "rental" },
]
