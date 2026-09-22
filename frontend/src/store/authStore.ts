import { create } from "zustand"
import type { AdminRole } from "../data/admin"

const STORAGE_KEY = "rap-auth"

type AuthSnapshot = {
  accessToken: string | null
  role: AdminRole | null
  userId: string | null
  isActive: boolean | null
}

function readSession(): AuthSnapshot {
  if (typeof window === "undefined") {
    return { accessToken: null, role: null, userId: null, isActive: null }
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, role: null, userId: null, isActive: null }
    return JSON.parse(raw) as AuthSnapshot
  } catch {
    return { accessToken: null, role: null, userId: null, isActive: null }
  }
}

function writeSession(snapshot: AuthSnapshot) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}

interface AuthState extends AuthSnapshot {
  setAuth: (
    accessToken: string,
    role: string,
    userId: string,
    isActive: boolean,
  ) => void
  clearAuth: () => void
}

const initial = readSession()

export const useAuthStore = create<AuthState>((set) => ({
  ...initial,
  setAuth: (accessToken, role, userId, isActive) => {
    const next = {
      accessToken,
      role: role as AdminRole,
      userId,
      isActive,
    }
    writeSession(next)
    set(next)
  },
  clearAuth: () => {
    const next = { accessToken: null, role: null, userId: null, isActive: null }
    writeSession(next)
    set(next)
  },
}))
