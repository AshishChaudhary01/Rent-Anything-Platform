import { create } from "zustand"
import type { KycStatus, MeUser } from "../types/account.types"
import { mediaUrl } from "../types/account.types"

interface AccountState {
  fullName: string
  addressLine: string
  city: string
  district: string
  avatarUrl: string
  email: string
  phone: string
  kycStatus: KycStatus
  hasAvatar: boolean
  profileComplete: boolean
  canTransact: boolean
  hydrateFromMe: (me: MeUser) => void
  setProfile: (patch: Partial<Pick<AccountState, "fullName" | "addressLine" | "city" | "district" | "avatarUrl">>) => void
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  reset: () => void
}

const emptyAccount = {
  fullName: "",
  addressLine: "",
  city: "",
  district: "",
  avatarUrl: "",
  email: "",
  phone: "",
  kycStatus: "NOT_STARTED" as KycStatus,
  hasAvatar: false,
  profileComplete: false,
  canTransact: false,
}

export const useAccountStore = create<AccountState>((set) => ({
  ...emptyAccount,
  hydrateFromMe: (me) =>
    set({
      fullName: me.fullName ?? "",
      addressLine: me.addressLine ?? "",
      city: me.city ?? "",
      district: me.district ?? "",
      avatarUrl: mediaUrl(me.avatarUrl),
      email: me.email ?? "",
      phone: me.phone ?? "",
      kycStatus: me.kycStatus ?? "NOT_STARTED",
      hasAvatar: Boolean(me.hasAvatar),
      profileComplete: Boolean(me.profileComplete),
      canTransact: Boolean(me.canTransact),
    }),
  setProfile: (patch) => set(patch),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  reset: () => set(emptyAccount),
}))
