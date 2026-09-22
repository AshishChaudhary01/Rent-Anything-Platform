import { create } from "zustand"
import { initialProfile, initialSecurity } from "../data/account"

interface AccountState {
  fullName: string
  addressLine: string
  city: string
  district: string
  avatarUrl: string
  email: string
  phone: string
  setProfile: (patch: Partial<Pick<AccountState, "fullName" | "addressLine" | "city" | "district" | "avatarUrl">>) => void
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  fullName: initialProfile.fullName,
  addressLine: initialProfile.addressLine,
  city: initialProfile.city,
  district: initialProfile.district,
  avatarUrl: initialProfile.avatarUrl,
  email: initialSecurity.email,
  phone: initialProfile.phone,
  setProfile: (patch) => set(patch),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
}))
