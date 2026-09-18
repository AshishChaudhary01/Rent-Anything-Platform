import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../utils/images"

export type CatalogItem = {
  id: number
  title: string
  rate: number
  unit: string
  location: string
  image: string
  category: string
}

const images = [tools01, tent01, backpack01, ladder01, pressureWasher01]
const locations = ["Lazimpat, Kathmandu", "Baneshwor, Kathmandu", "Patan, Lalitpur", "Bhaktapur", "Lakeside, Pokhara"]

const seeds: { category: string; titles: string[]; rates: number[] }[] = [
  {
    category: "electronics",
    titles: ["Sony WH-1000XM4", "MacBook Pro M1", "iPad Air", "DJI Mini Drone", "Kindle Paperwhite", "Anker Power Bank", "Logitech MX Keys", "Samsung Tab S9"],
    rates: [800, 1800, 900, 2200, 250, 150, 200, 700],
  },
  {
    category: "adventure-tools",
    titles: ["DeWalt Drill", "Bosch Driver Kit", "Makita Circular Saw", "Stanley Tool Chest", "Milwaukee Impact", "Ladder 8ft", "Pressure Washer", "Angle Grinder"],
    rates: [350, 400, 600, 300, 450, 200, 700, 380],
  },
  {
    category: "appliances",
    titles: ["Instant Pot", "Dyson Vacuum", "Philips Air Fryer", "Mixer Grinder", "Portable AC", "Steam Iron", "Rice Cooker", "Induction Cooktop"],
    rates: [400, 900, 350, 200, 1200, 150, 180, 250],
  },
  {
    category: "music",
    titles: ["Yamaha Acoustic Guitar", "Casio Keyboard", "Pearl Snare Drum", "Audio Technica Mic", "Ukulele Starter", "Violin 4/4", "DJ Controller", "Cajon Box"],
    rates: [500, 600, 350, 400, 150, 450, 800, 200],
  },
  {
    category: "photography",
    titles: ["Sony A7R IV Kit", "Canon EOS R5", "Canon EOS R6 Kit", "Godox Light Kit", "Tripod Manfrotto", "GoPro Hero", "85mm Prime Lens", "Reflector Kit"],
    rates: [999, 2500, 1800, 700, 200, 600, 450, 120],
  },
  {
    category: "outdoor",
    titles: ["North Face Tent", "4-Person Tent", "Hiking Backpack", "Sleeping Bag", "Camping Stove", "Trekking Poles", "Cooler Box", "Hammock Set"],
    rates: [600, 500, 250, 180, 150, 120, 200, 140],
  },
  {
    category: "home",
    titles: ["IKEA Dining Set", "Standing Fan", "Heater Oil", "Vacuum Robot", "Tool Ladder", "Sewing Machine", "Projector Screen", "Bean Bag"],
    rates: [800, 200, 250, 900, 150, 300, 180, 120],
  },
  {
    category: "gaming",
    titles: ["PS5 Console + Controllers", "Xbox Series S", "Nintendo Switch", "Gaming Chair", "RGB Keyboard", "Racing Wheel", "VR Headset", "Monitor 144Hz"],
    rates: [1500, 900, 700, 400, 180, 600, 1100, 500],
  },
  {
    category: "other",
    titles: ["Tissot Gentleman Auto", "Air Jordan 1 Retro", "Bose QC Headphones", "Suit Steamer", "Bike Helmet", "Yoga Mat Set", "Board Game Pack", "Costume Kit"],
    rates: [800, 400, 350, 120, 80, 60, 150, 200],
  },
]

export const catalog: CatalogItem[] = seeds.flatMap((seed, s) =>
  seed.titles.flatMap((title, i) =>
    [0, 1, 2].map((copy) => ({
      id: s * 100 + i * 10 + copy + 1,
      title: copy === 0 ? title : `${title} ${copy + 1}`,
      rate: seed.rates[i] + copy * 50,
      unit: "day",
      location: locations[(s + i + copy) % locations.length],
      image: images[(s + i + copy) % images.length],
      category: seed.category,
    }))
  )
)

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return catalog.filter((item) =>
    item.title.toLowerCase().includes(q) ||
    item.location.toLowerCase().includes(q) ||
    item.category.replace(/-/g, " ").includes(q)
  )
}

export function sortCatalog(items: CatalogItem[], sort: string) {
  const next = [...items]
  if (sort === "newest") next.sort((a, b) => b.id - a.id)
  if (sort === "oldest") next.sort((a, b) => a.id - b.id)
  if (sort === "price-high") next.sort((a, b) => b.rate - a.rate)
  if (sort === "price-low") next.sort((a, b) => a.rate - b.rate)
  if (sort === "name") next.sort((a, b) => a.title.localeCompare(b.title))
  return next
}

export function filterByPrice(items: CatalogItem[], price: string) {
  if (price === "under-500") return items.filter((i) => i.rate < 500)
  if (price === "500-1500") return items.filter((i) => i.rate >= 500 && i.rate <= 1500)
  if (price === "over-1500") return items.filter((i) => i.rate > 1500)
  return items
}

export const PAGE_SIZE = 20
