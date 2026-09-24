import { api } from "../config/api"

export type ChatMessage = {
  id: string
  fromMe: boolean
  text: string
  createdAt: string
}

export type ChatThread = {
  id: string
  listingId: string
  rentalId: string | null
  peerName: string
  peerId: string
  peerRole: string
  peerAvatarUrl: string | null
  listingTitle: string
  listingImage: string
  listingRate: string
  lastMessage: string
  updatedAt: string
  messages: ChatMessage[]
}

export const fetchChats = async (): Promise<ChatThread[]> => {
  const { data } = await api.get("/chats")
  return data
}

export const fetchChat = async (id: string): Promise<ChatThread> => {
  const { data } = await api.get(`/chats/${id}`)
  return data
}

export const openChat = async (payload: {
  listingId?: string
  rentalId?: string
  draft?: string
}): Promise<ChatThread> => {
  const { data } = await api.post("/chats", payload)
  return data
}

export const sendChatMessage = async (id: string, text: string): Promise<ChatThread> => {
  const { data } = await api.post(`/chats/${id}/messages`, { text })
  return data
}

export type UserReport = {
  id: string
  context: string
  reason: string
  detail: string
  listingTitle: string
  listingId: string | null
  accusedName: string
  accusedId: string | null
  rentalId: string | null
  proofs: string[]
  status: "PENDING" | "RESOLVED"
  createdAt: string
}

export const fetchMyReports = async (): Promise<UserReport[]> => {
  const { data } = await api.get("/reports/mine")
  return data
}

export const fetchReport = async (id: string): Promise<UserReport> => {
  const { data } = await api.get(`/reports/${id}`)
  return data
}

export const submitUserReport = async (payload: {
  context: string
  reason: string
  detail: string
  listingId?: string
  accusedId?: string
  rentalId?: string
  files: File[]
}): Promise<UserReport> => {
  const body = new FormData()
  body.append("context", payload.context)
  body.append("reason", payload.reason)
  body.append("detail", payload.detail)
  if (payload.listingId) body.append("listingId", payload.listingId)
  if (payload.accusedId) body.append("accusedId", payload.accusedId)
  if (payload.rentalId) body.append("rentalId", payload.rentalId)
  payload.files.forEach((file) => body.append("files", file))
  const { data } = await api.post("/reports", body)
  return data
}
