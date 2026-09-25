import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationKeys } from "../../lib/queryKeys"
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notification.service"
import { useAuthStore } from "../../store/authStore"

export function useNotifications(page = 0, size = 10) {
  const token = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: notificationKeys.page(page),
    queryFn: () => fetchNotifications(page, size),
    refetchInterval: 20000,
    enabled: Boolean(token),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all() }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all() }),
  })
}
