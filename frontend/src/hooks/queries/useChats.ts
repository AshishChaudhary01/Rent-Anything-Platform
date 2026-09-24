import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "../../lib/queryKeys"
import { fetchChat, fetchChats, openChat, sendChatMessage } from "../../services/chat.service"

export function useChats() {
  return useQuery({
    queryKey: chatKeys.all(),
    queryFn: fetchChats,
  })
}

export function useChat(id: string | undefined) {
  return useQuery({
    queryKey: chatKeys.detail(id || ""),
    queryFn: () => fetchChat(id!),
    enabled: Boolean(id),
    refetchInterval: 4000,
  })
}

export function useOpenChat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: openChat,
    onSuccess: (thread) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all() })
      queryClient.setQueryData(chatKeys.detail(thread.id), thread)
    },
  })
}

export function useSendChat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => sendChatMessage(id, text),
    onSuccess: (thread) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all() })
      queryClient.setQueryData(chatKeys.detail(thread.id), thread)
    },
  })
}
