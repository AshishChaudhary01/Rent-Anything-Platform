import { api } from "../config/api"

export type NotificationKind =
  | "WELCOME"
  | "REQUEST"
  | "BOOKING"
  | "PAYMENT"
  | "PICKUP"
  | "RENTAL"
  | "RETURN"
  | "MESSAGE"
  | "REPORT"

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  path: string | null
  image: string | null
  read: boolean
  createdAt: string
}

export type NotificationPage = {
  page: number
  size: number
  total: number
  unread: number
  items: AppNotification[]
}

export const fetchNotifications = async (page = 0, size = 10): Promise<NotificationPage> => {
  const { data } = await api.get("/notifications", { params: { page, size } })
  return data
}

export const markNotificationRead = async (id: string) => {
  await api.post(`/notifications/${id}/read`)
}

export const markAllNotificationsRead = async () => {
  await api.post("/notifications/read-all")
}
