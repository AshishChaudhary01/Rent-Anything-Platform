import { useQuery } from "@tanstack/react-query"
import { reviewKeys } from "../../lib/queryKeys"
import { fetchPublicListings, fetchPublicProfile, fetchPublicReviews } from "../../services/publicProfile.service"

export function usePublicProfile(id: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.profile(id || ""),
    queryFn: () => fetchPublicProfile(id!),
    enabled: Boolean(id),
  })
}

export function usePublicReviews(
  id: string | undefined,
  params: { page?: number; size?: number; rating?: number; role?: string; sort?: string },
) {
  return useQuery({
    queryKey: reviewKeys.user(id || "", params),
    queryFn: () => fetchPublicReviews(id!, params),
    enabled: Boolean(id),
  })
}

export function usePublicListings(
  id: string | undefined,
  params: { page?: number; size?: number; status?: string; sort?: string },
) {
  return useQuery({
    queryKey: reviewKeys.listings(id || "", params),
    queryFn: () => fetchPublicListings(id!, params),
    enabled: Boolean(id),
  })
}
