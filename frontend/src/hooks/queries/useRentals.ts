import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptRental,
  cancelRental,
  createRental,
  declineRental,
  deleteWallet,
  fetchListingReviews,
  fetchMyRentals,
  fetchOwnedRentals,
  fetchPaymentConfig,
  fetchRental,
  fetchWallets,
  finishReturn,
  reportNoShow,
  saveWallet,
  scheduleReturn,
  setDefaultWallet,
  startRental,
  submitRentalReview,
} from "../../services/rental.service"
import { listingKeys, rentalKeys, reviewKeys, walletKeys } from "../../lib/queryKeys"

export function usePaymentConfig() {
  return useQuery({
    queryKey: rentalKeys.config(),
    queryFn: fetchPaymentConfig,
  })
}

export function useMyRentals() {
  return useQuery({
    queryKey: rentalKeys.mine(),
    queryFn: fetchMyRentals,
  })
}

export function useOwnedRentals() {
  return useQuery({
    queryKey: rentalKeys.owned(),
    queryFn: fetchOwnedRentals,
  })
}

export function useListingReviews(listingId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.listing(listingId || ""),
    queryFn: () => fetchListingReviews(listingId!),
    enabled: Boolean(listingId),
  })
}

export function useRental(id: string | undefined, refetchInterval?: number) {
  return useQuery({
    queryKey: rentalKeys.detail(id || ""),
    queryFn: () => fetchRental(id!),
    enabled: Boolean(id),
    refetchInterval,
  })
}

export function useCreateRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRental,
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useStartRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => startRental(id, code),
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useCancelRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelRental,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rentalKeys.all() }),
  })
}

export function useAcceptRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptRental,
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useDeclineRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: declineRental,
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useScheduleReturn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string; date: string; time: string; location: string; latitude?: number; longitude?: number }) =>
      scheduleReturn(id, payload),
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useFinishReturn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => finishReturn(id, code),
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.invalidateQueries({ queryKey: listingKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useReportNoShow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reportNoShow,
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment?: string }) =>
      submitRentalReview(id, { rating, comment }),
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all() })
      queryClient.invalidateQueries({ queryKey: reviewKeys.listing(rental.listingId) })
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.setQueryData(rentalKeys.detail(rental.id), rental)
    },
  })
}

export function useWallets() {
  return useQuery({
    queryKey: walletKeys.all(),
    queryFn: fetchWallets,
  })
}

export function useSaveWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.all() }),
  })
}

export function useSetDefaultWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: setDefaultWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.all() }),
  })
}

export function useDeleteWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: walletKeys.all() }),
  })
}
