export const authKeys = {
  all: () => ["auth"] as const,
  currentUser: () => ["auth", "me"] as const,
};

export const listingKeys = {
  all: () => ["listings"] as const,
  browse: (params: object) => ["listings", "browse", params] as const,
  mine: () => ["listings", "mine"] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

export const rentalKeys = {
  all: () => ["rentals"] as const,
  mine: () => ["rentals", "mine"] as const,
  owned: () => ["rentals", "owned"] as const,
  detail: (id: string) => ["rentals", "detail", id] as const,
  config: () => ["rentals", "config"] as const,
};

export const reviewKeys = {
  listing: (id: string) => ["reviews", "listing", id] as const,
  user: (id: string, params?: object) => ["reviews", "user", id, params] as const,
  profile: (id: string) => ["reviews", "profile", id] as const,
  listings: (id: string, params?: object) => ["reviews", "listings", id, params] as const,
};

export const walletKeys = {
  all: () => ["wallets"] as const,
};

export const chatKeys = {
  all: () => ["chats"] as const,
  detail: (id: string) => ["chats", "detail", id] as const,
};

export const reportKeys = {
  all: () => ["reports"] as const,
  mine: () => ["reports", "mine"] as const,
  detail: (id: string) => ["reports", "detail", id] as const,
};

export const notificationKeys = {
  all: () => ["notifications"] as const,
  page: (page: number) => ["notifications", "page", page] as const,
};

export const adminKeys = {
  all: () => ["admin"] as const,
  overview: () => ["admin", "overview"] as const,
  users: () => ["admin", "users"] as const,
  user: (id: string) => ["admin", "users", id] as const,
  listings: () => ["admin", "listings"] as const,
  listing: (id: string) => ["admin", "listings", id] as const,
  rentals: () => ["admin", "rentals"] as const,
  rental: (id: string) => ["admin", "rentals", id] as const,
  reports: () => ["admin", "reports"] as const,
  report: (id: string) => ["admin", "reports", id] as const,
  staff: () => ["admin", "staff"] as const,
  staffMember: (id: string) => ["admin", "staff", id] as const,
  kyc: () => ["admin", "kyc"] as const,
  kycCase: (id: string) => ["admin", "kyc", id] as const,
};
