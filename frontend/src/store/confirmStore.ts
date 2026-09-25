import { create } from "zustand"

export type ConfirmOptions = {
  title: string
  body?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

type ConfirmState = {
  open: boolean
  options: ConfirmOptions | null
  ask: (options: ConfirmOptions) => Promise<boolean>
  settle: (ok: boolean) => void
}

let pending: ((ok: boolean) => void) | null = null

export const useConfirmStore = create<ConfirmState>((set) => ({
  open: false,
  options: null,
  ask: (options) =>
    new Promise<boolean>((resolve) => {
      pending?.(false)
      pending = resolve
      set({ open: true, options })
    }),
  settle: (ok) => {
    pending?.(ok)
    pending = null
    set({ open: false, options: null })
  },
}))

export function askConfirm(options: ConfirmOptions) {
  return useConfirmStore.getState().ask(options)
}
