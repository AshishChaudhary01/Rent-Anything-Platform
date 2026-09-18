import { backpack01, profile01, tent01, tools01 } from "../../../../utils/images"
import type { ChatContext, ChatThread } from "./chatTypes"

export const chatWithOwner: ChatContext = {
  threadId: "anish-sony",
  peerName: "Anish Sharma",
  peerRole: "Owner",
  listingTitle: "Sony A7R IV Professional Kit",
  listingImage: tools01,
  listingRate: "Nrs. 999 / day",
}

export const chatWithRenter: ChatContext = {
  threadId: "anish-sony",
  peerName: "Anish Sharma",
  peerRole: "Renter",
  listingTitle: "Sony A7R IV Professional Kit",
  listingImage: tools01,
  listingRate: "Nrs. 999 / day",
}

export const chatWithArpan: ChatContext = {
  threadId: "arpan-sony",
  peerName: "Arpan Sharma",
  peerRole: "Owner",
  listingTitle: "Sony A7R IV 61.0MP Full-frame Camera",
  listingImage: tools01,
  listingRate: "Nrs. 4,000 / day",
}

export const initialThreads: ChatThread[] = [
  {
    ...chatWithOwner,
    lastMessage: "See you at Lazimpat at 10:30.",
    time: "2m",
    messages: [
      { id: "1", fromMe: false, text: "Hi, the kit is available for those dates." },
      { id: "2", fromMe: true, text: "Great. Meetup at Lazimpat works for me." },
      { id: "3", fromMe: false, text: "See you at Lazimpat at 10:30." },
    ],
  },
  {
    ...chatWithArpan,
    lastMessage: "Typically replies in 5 mins",
    time: "1h",
    messages: [
      { id: "1", fromMe: true, text: "Is the extra battery included?" },
      { id: "2", fromMe: false, text: "Yes, two batteries and a 128GB card." },
    ],
  },
  {
    threadId: "ramesh-tent",
    peerName: "Ramesh Kumar",
    peerRole: "Renter",
    listingTitle: "North Face Tent",
    listingImage: tent01,
    listingRate: "Nrs. 600 / day",
    lastMessage: "Can I pick up on Nov 2?",
    time: "3h",
    messages: [
      { id: "1", fromMe: false, text: "Can I pick up on Nov 2?" },
    ],
  },
  {
    threadId: "pending-tissot",
    peerName: "Anish Sharma",
    peerRole: "Owner",
    listingTitle: "Tissot Gentleman Auto",
    listingImage: backpack01,
    listingRate: "Nrs. 800 / day",
    lastMessage: "Waiting for your request.",
    time: "1d",
    messages: [
      { id: "1", fromMe: true, text: "Is this still available this weekend?" },
      { id: "2", fromMe: false, text: "Waiting for your request." },
    ],
  },
]

export const peerImage = profile01
