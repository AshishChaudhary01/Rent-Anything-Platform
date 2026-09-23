import { api } from "../config/api"
import type { MeUser } from "../types/account.types"

export const fetchMe = async (): Promise<MeUser> => {
  const { data } = await api.get("/account/me")
  return data
}

export const updateProfile = async (payload: {
  fullName: string
  phone: string
  addressLine: string
  city: string
  district: string
}): Promise<MeUser> => {
  const { data } = await api.patch("/account/profile", payload)
  return data
}

export const updateContact = async (payload: {
  email?: string
  phone?: string
}): Promise<MeUser> => {
  const { data } = await api.patch("/account/contact", payload)
  return data
}

export const changePassword = async (payload: {
  currentPassword: string
  newPassword: string
}) => {
  await api.post("/account/password", payload)
}

export const uploadAvatar = async (file: File): Promise<MeUser> => {
  const body = new FormData()
  body.append("file", file)
  const { data } = await api.post("/account/avatar", body)
  return data
}

export const logoutUser = async () => {
  await api.post("/auth/logout")
}

export const submitKyc = async (payload: {
  fullName: string
  dateOfBirth: string
  documentType: string
  documentNumber: string
  front: File
  back: File
}): Promise<MeUser> => {
  const body = new FormData()
  body.append("fullName", payload.fullName)
  body.append("dateOfBirth", payload.dateOfBirth)
  body.append("documentType", payload.documentType)
  body.append("documentNumber", payload.documentNumber)
  body.append("front", payload.front)
  body.append("back", payload.back)
  const { data } = await api.post("/account/kyc", body)
  return data
}
