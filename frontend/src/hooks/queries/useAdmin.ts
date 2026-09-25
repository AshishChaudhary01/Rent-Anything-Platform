import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminKeys } from "../../lib/queryKeys"
import {
  createAdminAccount,
  deleteAdminAccount,
  fetchAdminKyc,
  fetchAdminKycCase,
  fetchAdminListing,
  fetchAdminListings,
  fetchAdminOverview,
  fetchAdminRental,
  fetchAdminRentals,
  fetchAdminReport,
  fetchAdminReports,
  fetchAdminStaff,
  fetchAdminStaffMember,
  fetchAdminUser,
  fetchAdminUsers,
  resolveAdminReport,
  reviewAdminKyc,
  setAdminListingStatus,
  setAdminStaffStatus,
  setAdminUserStatus,
  updateAdminAccount,
} from "../../services/admin.service"

export function useAdminOverview() {
  return useQuery({ queryKey: adminKeys.overview(), queryFn: fetchAdminOverview })
}

export function useAdminUsers() {
  return useQuery({ queryKey: adminKeys.users(), queryFn: fetchAdminUsers })
}

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.user(id || ""),
    queryFn: () => fetchAdminUser(id!),
    enabled: Boolean(id),
  })
}

export function useAdminListings() {
  return useQuery({ queryKey: adminKeys.listings(), queryFn: fetchAdminListings })
}

export function useAdminListing(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.listing(id || ""),
    queryFn: () => fetchAdminListing(id!),
    enabled: Boolean(id),
  })
}

export function useAdminRentals() {
  return useQuery({ queryKey: adminKeys.rentals(), queryFn: fetchAdminRentals })
}

export function useAdminRental(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.rental(id || ""),
    queryFn: () => fetchAdminRental(id!),
    enabled: Boolean(id),
  })
}

export function useAdminReports() {
  return useQuery({ queryKey: adminKeys.reports(), queryFn: fetchAdminReports })
}

export function useAdminReport(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.report(id || ""),
    queryFn: () => fetchAdminReport(id!),
    enabled: Boolean(id),
  })
}

export function useAdminKyc() {
  return useQuery({ queryKey: adminKeys.kyc(), queryFn: fetchAdminKyc })
}

export function useAdminKycCase(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.kycCase(id || ""),
    queryFn: () => fetchAdminKycCase(id!),
    enabled: Boolean(id),
  })
}

export function useSetAdminUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => setAdminUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useSetAdminListingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => setAdminListingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useReviewAdminKyc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, approved, notes }: { id: string; approved: boolean; notes: string }) =>
      reviewAdminKyc(id, approved, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useResolveAdminReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes: string }) =>
      resolveAdminReport(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all() })
    },
  })
}

export function useCreateAdminAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAdminAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useAdminStaff() {
  return useQuery({ queryKey: adminKeys.staff(), queryFn: fetchAdminStaff })
}

export function useAdminStaffMember(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.staffMember(id || ""),
    queryFn: () => fetchAdminStaffMember(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateAdminAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: { fullName: string; email: string; password?: string; phone?: string }
    }) => updateAdminAccount(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useSetAdminStaffStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => setAdminStaffStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}

export function useDeleteAdminAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.all() }),
  })
}
