import { create } from "zustand"
import {
  initialAdminKyc,
  initialAdminListings,
  initialAdminReports,
  initialAdminRentals,
  initialAdminUsers,
  initialPlatformSettings,
  type AdminKycCase,
  type AdminListing,
  type AdminReport,
  type AdminRental,
  type AdminRole,
  type AdminUser,
  type KycCaseStatus,
  type ListingStatus,
  type PlatformSettings,
  type ReportResolution,
  type UserStatus,
} from "../data/admin"

interface AdminState {
  users: AdminUser[]
  listings: AdminListing[]
  rentals: AdminRental[]
  reports: AdminReport[]
  kycCases: AdminKycCase[]
  settings: PlatformSettings
  setUserStatus: (id: string, status: UserStatus) => void
  setListingStatus: (id: number, status: ListingStatus) => void
  resolveReport: (id: string, resolution: ReportResolution) => void
  reviewKyc: (id: string, status: Exclude<KycCaseStatus, "Pending">, reviewer: string, notes: string) => void
  saveSettings: (settings: PlatformSettings) => void
  createAdmin: (input: { fullName: string; email: string; phone: string }) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  users: initialAdminUsers,
  listings: initialAdminListings,
  rentals: initialAdminRentals,
  reports: initialAdminReports,
  kycCases: initialAdminKyc,
  settings: initialPlatformSettings,
  setUserStatus: (id, status) =>
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, status } : u)),
    })),
  setListingStatus: (id, status) =>
    set((s) => ({
      listings: s.listings.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  resolveReport: (id, resolution) =>
    set((s) => ({
      reports: s.reports.map((r) => (r.id === id ? { ...r, status: "Resolved", resolution } : r)),
    })),
  reviewKyc: (id, status, reviewer, notes) =>
    set((s) => {
      const kycCases = s.kycCases.map((item) =>
        item.id === id ? { ...item, status, reviewer, notes } : item,
      )
      const updated = kycCases.find((item) => item.id === id)
      return {
        kycCases,
        users: s.users.map((u) => (u.id === updated?.userId ? { ...u, kycStatus: status } : u)),
      }
    }),
  saveSettings: (settings) => set({ settings }),
  createAdmin: ({ fullName, email, phone }) =>
    set((s) => ({
      users: [
        ...s.users,
        {
          id: `admin-${crypto.randomUUID()}`,
          fullName,
          email,
          phone,
          role: "ADMIN" as AdminRole,
          status: "Active",
          joined: "Today",
          joinedAt: new Date().toISOString().slice(0, 10),
          location: "Kathmandu",
          addressLine: "RAP HQ, New Baneshwor",
          city: "Kathmandu",
          district: "Kathmandu",
          bio: "Staff administrator.",
          kycStatus: "Verified",
          listings: 0,
          rentals: 0,
        },
      ],
    })),
}))
