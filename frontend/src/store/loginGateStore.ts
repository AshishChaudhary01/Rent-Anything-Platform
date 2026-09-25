import { create } from "zustand"

const NEXT_KEY = "rap-next"

type LoginGateState = {
  open: boolean
  message: string
  next: string
  openGate: (options?: { message?: string; next?: string }) => void
  closeGate: () => void
}

export const useLoginGateStore = create<LoginGateState>((set) => ({
  open: false,
  message: "Sign in or create an account to continue.",
  next: "/user",
  openGate: (options) => {
    const next = options?.next || `${window.location.pathname}${window.location.search}`
    sessionStorage.setItem(NEXT_KEY, next)
    set({
      open: true,
      message: options?.message || "Sign in or create an account to continue.",
      next,
    })
  },
  closeGate: () => set({ open: false }),
}))

export function openLoginGate(options?: { message?: string; next?: string }) {
  useLoginGateStore.getState().openGate(options)
}

export function takePostLoginPath(role: string) {
  const stored = sessionStorage.getItem(NEXT_KEY) || ""
  sessionStorage.removeItem(NEXT_KEY)
  if (role !== "USER") {
    return stored.startsWith("/admin") ? stored : "/admin"
  }
  if (!stored || stored.startsWith("/auth") || stored.startsWith("/admin")) {
    return "/user"
  }
  return stored
}

export function rememberAuthReturn(path?: string) {
  const next = path || `${window.location.pathname}${window.location.search}`
  if (next && !next.startsWith("/auth")) {
    sessionStorage.setItem(NEXT_KEY, next)
  }
}
