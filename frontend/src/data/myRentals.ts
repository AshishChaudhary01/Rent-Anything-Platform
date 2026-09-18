import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../utils/images"

const images = [tools01, backpack01, tent01, pressureWasher01, ladder01]

const pendingTitles = [
  "Sony A7R IV Mirrorless",
  "Tissot Gentleman Auto",
  "DJI Mini Drone",
  "Yamaha Acoustic Guitar",
  "GoPro Hero",
  "MacBook Pro M1",
  "North Face Tent",
  "Canon EOS R5",
  "DeWalt Drill",
  "iPad Air",
  "Bosch Driver Kit",
  "Kindle Paperwhite",
  "Ukulele Starter",
  "Ladder 8ft",
  "Philips Air Fryer",
  "Audio Technica Mic",
  "Tripod Manfrotto",
  "Anker Power Bank",
  "Stanley Tool Chest",
  "Casio Keyboard",
  "Dyson Vacuum",
  "85mm Prime Lens",
]

const pendingStatuses = ["Requested 2h ago", "Waiting for Owner", "Requested yesterday", "Awaiting confirmation"]

export const pendingRentals = pendingTitles.map((title, i) => ({
  id: i + 1,
  image: images[i % images.length],
  title,
  status: pendingStatuses[i % pendingStatuses.length],
}))

const activeTitles = [
  "PS5 Console + Controllers",
  "Canon EOS R6 Kit",
  "Sony WH-1000XM4",
  "4-Person Tent",
  "Pressure Washer",
  "MacBook Pro M1",
  "Godox Light Kit",
  "Instant Pot",
  "Pearl Snare Drum",
  "Milwaukee Impact",
  "Portable AC",
  "DJ Controller",
  "Samsung Tab S9",
  "Makita Circular Saw",
  "Violin 4/4",
  "Steam Iron",
  "Reflector Kit",
  "Angle Grinder",
  "Rice Cooker",
  "Cajon Box",
  "Mixer Grinder",
  "Logitech MX Keys",
]

export const activeRentals = activeTitles.map((title, i) => {
  const days = (i % 12) + 1
  const amountValue = 800 + i * 350
  return {
    id: i + 1,
    image: images[i % images.length],
    title,
    returns: `Returns in ${days} Day${days > 1 ? "s" : ""}`,
    amount: `NPR ${amountValue.toLocaleString()}`,
  }
})
