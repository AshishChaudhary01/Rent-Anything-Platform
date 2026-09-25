import { create } from "zustand"
import { helpTopicForPath } from "../lib/helpGuides"

type HelpState = {
  open: boolean
  topicId: string
  openHelp: (topicId?: string) => void
  closeHelp: () => void
}

export const useHelpStore = create<HelpState>((set) => ({
  open: false,
  topicId: "browse",
  openHelp: (topicId) =>
    set({
      open: true,
      topicId: topicId || helpTopicForPath(window.location.pathname).id,
    }),
  closeHelp: () => set({ open: false }),
}))

export function openHelp(topicId?: string) {
  useHelpStore.getState().openHelp(topicId)
}
