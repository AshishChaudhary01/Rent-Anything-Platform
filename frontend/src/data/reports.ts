export const REPORT_CONTEXTS = ["listing", "rental", "meetup", "return", "chat", "request"] as const
export type ReportContext = (typeof REPORT_CONTEXTS)[number]

export const REPORT_REASONS: Record<ReportContext, string[]> = {
  listing: ["Listing policy violation", "Item not as described", "Suspicious listing", "Other"],
  rental: ["Item not as described", "Damage dispute", "Late return", "No-show at meetup", "Other"],
  meetup: ["No-show at meetup", "Unsafe meetup", "Other"],
  return: ["Damage dispute", "Late return", "Item not as described", "Other"],
  chat: ["Harassment", "Scam / fraud", "Other"],
  request: ["Suspicious renter", "Harassment", "Scam / fraud", "Other"],
}

export type ReportDraft = {
  context: ReportContext
  listingTitle: string
  listingId?: string
  accusedName: string
  accusedId?: string
  rentalId?: string
  reason?: string
}

export function reportHref(draft: ReportDraft) {
  const params = new URLSearchParams()
  params.set("context", draft.context)
  params.set("listingTitle", draft.listingTitle)
  params.set("accusedName", draft.accusedName)
  if (draft.listingId) params.set("listingId", draft.listingId)
  if (draft.accusedId) params.set("accusedId", draft.accusedId)
  if (draft.rentalId) params.set("rentalId", draft.rentalId)
  if (draft.reason) params.set("reason", draft.reason)
  return `/user/report?${params.toString()}`
}
