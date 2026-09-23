import axios from "axios"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

export function apiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.details ?? error.response?.data?.message
    if (typeof message === "string" && message.trim()) return message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function apiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {}
  const fields = error.response?.data?.fields
  if (fields && typeof fields === "object" && !Array.isArray(fields)) {
    return Object.fromEntries(
      Object.entries(fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    )
  }
  const details = error.response?.data?.details
  if (typeof details !== "string") return {}
  const parsed: Record<string, string> = {}
  for (const part of details.split(";")) {
    const [name, ...rest] = part.split(":")
    const message = rest.join(":").trim()
    if (name?.trim() && message) parsed[name.trim()] = message
  }
  return parsed
}

export function applyApiFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: unknown,
  fallbackField?: Path<T>,
) {
  const fields = apiFieldErrors(error)
  const entries = Object.entries(fields)
  if (entries.length === 0) {
    if (fallbackField) {
      setError(fallbackField, { type: "server", message: apiErrorMessage(error) })
    }
    return
  }
  for (const [name, message] of entries) {
    setError(name as Path<T>, { type: "server", message })
  }
}
