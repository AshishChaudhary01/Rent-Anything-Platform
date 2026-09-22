import { esewa, khalti, profile01 } from "../utils/images"

export type WalletId = "esewa" | "khalti"

export type LinkedWallet = {
  id: WalletId
  label: string
  logo: string
  accountHint: string
  isDefault: boolean
}

export const initialProfile = {
  fullName: "Ram Rai",
  phone: "9801234567",
  addressLine: "House 12, Lazimpat",
  city: "Kathmandu",
  district: "Kathmandu",
  avatarUrl: profile01,
}

export const availableWallets: { id: WalletId; label: string; logo: string }[] = [
  { id: "esewa", label: "eSewa", logo: esewa },
  { id: "khalti", label: "Khalti", logo: khalti },
]

export const initialLinkedWallets: LinkedWallet[] = [
  {
    id: "esewa",
    label: "eSewa",
    logo: esewa,
    accountHint: "98******67",
    isDefault: true,
  },
]

export const initialSecurity = {
  email: "ramrai@gmail.com",
}
