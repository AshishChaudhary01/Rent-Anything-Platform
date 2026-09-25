import { create } from "zustand"
import type { AdminRole } from "../data/admin"

const STORAGE_KEY = "rap-auth"

type AuthSnapshot = {
  accessToken: string | null
  role: AdminRole | null
  userId: string | null
  isActive: boolean | null
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function readSession(): AuthSnapshot {
  const store = storage()
  if (!store) {
    return { accessToken: null, role: null, userId: null, isActive: null }
  }
  try {
    const raw = store.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, role: null, userId: null, isActive: null }
    const snapshot = JSON.parse(raw) as AuthSnapshot
    if (window.sessionStorage.getItem(STORAGE_KEY)) {
      store.setItem(STORAGE_KEY, raw)
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
    return snapshot
  } catch {
    return { accessToken: null, role: null, userId: null, isActive: null }
  }
}

function writeSession(snapshot: AuthSnapshot) {
  const store = storage()
  if (!store) return
  store.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  window.sessionStorage.removeItem(STORAGE_KEY)
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
