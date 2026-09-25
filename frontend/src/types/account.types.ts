export type KycStatus = "NOT_STARTED" | "PENDING" | "VERIFIED" | "REJECTED"

export type MeUser = {
  id: string
  fullName: string
  email: string
  phone: string | null
  addressLine: string | null
  city: string | null
  district: string | null
  avatarUrl: string | null
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  kycStatus: KycStatus
  hasAvatar: boolean
  profileComplete: boolean
  canTransact: boolean
  hasPassword: boolean
  createdAt: string
  isActive: boolean
  accountLocked: boolean
  lockedAt: string | null
}

export function mediaUrl(path?: string | null) {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path
  }
  const base = import.meta.env.VITE_BACKEND_URL ?? ""
  return `${base}${path}`
}
