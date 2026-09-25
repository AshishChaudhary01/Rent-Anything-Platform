import { api } from "../config/api"

export async function sendPasswordResetOtp(email: string) {
  await api.post("/auth/otp", { email, purpose: "RESET_PASSWORD" })
}

export async function resetPasswordWithOtp(payload: { email: string; code: string; password: string }) {
  await api.post("/auth/password/reset", payload)
}

export async function sendEmailChangeOtp(email: string) {
  await api.post("/account/email/otp", { email, purpose: "CHANGE_EMAIL" })
}

export async function confirmEmailChange(payload: { email: string; code: string }) {
  const { data } = await api.post("/account/email", payload)
  return data
}
