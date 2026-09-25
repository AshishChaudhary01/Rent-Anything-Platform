import { api } from "../config/api"

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export type ContactResult = {
  received: boolean
  emailed: boolean
}

export const submitContact = async (payload: ContactPayload): Promise<ContactResult> => {
  const { data } = await api.post("/contact", payload)
  return data
}
