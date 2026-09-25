export type HelpTopic = {
  id: string
  title: string
  summary: string
  steps: string[]
  tips?: string[]
  paths: string[]
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "browse",
    title: "Browse and search",
    summary: "Find items near you, open a listing, and start a rental when you are ready.",
    paths: ["/user", "/user/search", "/user/category", "/user/people"],
    steps: [
      "Use search or categories on Home to find an item.",
      "Open a listing to see photos, rate, deposit, and the owner’s profile.",
      "Tap Request to rent, pick dates, and send a request. The owner must accept before you pay.",
    ],
    tips: ["You can browse without KYC. Listing an item or paying for a rental needs a complete, verified account."],
  },
  {
    id: "account-setup",
    title: "Set up your account",
    summary: "RAP needs a photo, profile details, and verified KYC before you list or rent.",
    paths: ["/user/profile", "/user/kyc"],
    steps: [
      "Add a real profile photo on Profile.",
      "Save your name, phone, and address.",
      "Submit KYC with clear photos of your ID. Wait until status is Verified.",
      "Then you can publish listings and send rental requests.",
    ],
    tips: ["KYC is reviewed by RAP staff. You will get a notification when it is approved or rejected."],
  },
  {
    id: "rent-request",
    title: "Request to rent",
    summary: "Choose dates, send a request, and wait for the owner to accept.",
    paths: ["/user/rent/request-to-rent", "/user/listing"],
    steps: [
      "Pick start and end dates that the listing is free.",
      "Send the request. You do not pay until the owner accepts.",
      "Stay on the waiting screen or check My rentals until they accept or decline.",
      "If they accept, pay the commitment fee to lock the booking.",
    ],
    tips: ["You cannot rent your own listing. Chat is available after a request exists."],
  },
  {
    id: "rent-pay",
    title: "Pay with eSewa",
    summary: "Commitment fee first, remaining rent after meetup is confirmed.",
    paths: ["/user/rent/checkout", "/user/rent/waiting", "/user/rent/payment"],
    steps: [
      "After the owner accepts, pay the commitment fee in eSewa.",
      "Complete the meetup QR step with the owner.",
      "Pay the remaining rent so the rental can start.",
      "RAP holds funds in escrow until the flow says they are released.",
    ],
    tips: ["If payment is cancelled, you can retry from Checkout. Do not close eSewa until you see RAP confirm it."],
  },
  {
    id: "rent-meetup",
    title: "Pickup meetup and QR",
    summary: "Meet in person and scan one QR. Only one of you scans; the other shows the code.",
    paths: ["/user/rent/meetup", "/user/rent/confirmation"],
    steps: [
      "Agree a place in chat, then meet with the item.",
      "One person shows the RAP QR; the other scans it in the app or from a photo.",
      "After a good scan, pay remaining rent if RAP asks for it.",
      "If the other person never arrives, use Record no-show. That settles the commitment fee.",
    ],
    tips: ["Do not record a no-show unless they truly did not come. That action cannot be undone."],
  },
  {
    id: "rent-return",
    title: "Return the item",
    summary: "Schedule the return, share condition photos, then scan QR at handover.",
    paths: [
      "/user/rent/return-schedule",
      "/user/rent/condition-proof",
      "/user/rent/return-meetup",
      "/user/rent/owner-return-review",
      "/user/rent/owner-return-pickup",
      "/user/rent/owner-return-confirm",
      "/user/rent/rate",
    ],
    steps: [
      "The renter schedules a return meetup.",
      "Upload condition photos so both sides have proof.",
      "Meet and scan QR. The owner reviews and confirms pickup.",
      "RAP then settles deposit, commission, and payout.",
      "Leave a rating after the rental completes.",
    ],
  },
  {
    id: "owner-listing",
    title: "List an item",
    summary: "Publish photos, price, deposit, and location so renters can find you.",
    paths: ["/user/add-listing", "/user/my-listings", "/user/my-listing-details"],
    steps: [
      "Complete account setup (photo, profile, KYC) first.",
      "Add clear photos, a fair daily rate, and a security deposit.",
      "Set the pickup location on the map.",
      "Publish, then pause the listing if you need a break. You cannot pause it while it is rented.",
    ],
    tips: ["Requests for this listing appear on the listing page and under My requests."],
  },
  {
    id: "owner-requests",
    title: "Handle rental requests",
    summary: "Accept or decline, then follow pickup and return with the renter.",
    paths: ["/user/listing-requests", "/user/request-details", "/user/rental-details"],
    steps: [
      "Open My requests or the listing’s request list.",
      "Accept so the renter can pay, or decline if the dates do not work.",
      "After they pay, meet and complete the QR pickup.",
      "When the rental ends, follow the owner return steps to get paid.",
    ],
    tips: ["Decline cannot be undone from the app. Chat before you decide if you need more info."],
  },
  {
    id: "rentals-hub",
    title: "Your rentals",
    summary: "Track pending, active, and past rentals from one place.",
    paths: ["/user/my-rentals", "/user/pending-requests", "/user/active-rentals", "/user/rental-history"],
    steps: [
      "Pending: waiting on the owner or on payment.",
      "Active: the item is out. Follow meetup or return from the card.",
      "History: completed or cancelled rentals and receipts.",
    ],
  },
  {
    id: "payments-chat",
    title: "Payments, chat, and reports",
    summary: "eSewa for rent, in-app chat for coordination, reports if something goes wrong.",
    paths: ["/user/payment-methods", "/user/chat", "/user/report", "/user/reports", "/user/notifications"],
    steps: [
      "Pay commitment and remaining rent through RAP’s eSewa checkout, not privately.",
      "Use in-app chat so both of you have a record.",
      "Report a problem from the rental or listing if you need RAP staff to step in.",
      "Watch Notifications for KYC, requests, and ticket updates.",
    ],
  },
  {
    id: "security",
    title: "Sign-in and security",
    summary: "Email and password accounts can change their password. Google accounts sign in with Google only.",
    paths: ["/user/security", "/auth/login", "/auth/register", "/auth/forgot-password"],
    steps: [
      "Register with email or continue with Google.",
      "Google accounts do not set a RAP password.",
      "Email accounts can change password on Security, or reset it from Forgot password.",
    ],
  },
]

const DEFAULT_TOPIC_ID = "browse"

export function helpTopicById(id?: string | null) {
  return HELP_TOPICS.find((topic) => topic.id === id) ?? HELP_TOPICS.find((topic) => topic.id === DEFAULT_TOPIC_ID)!
}

export function helpTopicForPath(pathname: string) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/"
  const ranked = [...HELP_TOPICS].sort((a, b) => longestPrefix(b, path) - longestPrefix(a, path))
  const match = ranked.find((topic) => longestPrefix(topic, path) > 0)
  return match ?? helpTopicById(DEFAULT_TOPIC_ID)
}

function longestPrefix(topic: HelpTopic, path: string) {
  let best = 0
  for (const prefix of topic.paths) {
    const base = prefix.replace(/\/$/, "") || "/"
    if (path === base || path.startsWith(`${base}/`)) {
      best = Math.max(best, base.length)
    }
  }
  return best
}
