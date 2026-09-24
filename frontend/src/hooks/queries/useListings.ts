import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listingKeys } from "../../lib/queryKeys"
import { createListing, fetchListing, fetchListings, fetchMyListings, updateListing } from "../../services/listing.service"

export function useListings(params: {
  category?: string
  q?: string
  sort?: string
  page?: number
  size?: number
  enabled?: boolean
} = {}) {
  const { enabled = true, ...queryParams } = params
  return useQuery({
    queryKey: listingKeys.browse(queryParams),
    queryFn: () => fetchListings(queryParams),
    enabled,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: fetchMyListings,
  })
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: listingKeys.detail(id || ""),
    queryFn: () => fetchListing(id!),
    enabled: Boolean(id),
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all() })
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateListing>[1] }) =>
      updateListing(id, payload),
    onSuccess: (listing) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all() })
      queryClient.setQueryData(listingKeys.detail(listing.id), listing)
    },
  })
}
