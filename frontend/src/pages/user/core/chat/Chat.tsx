import { useEffect, useMemo, useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import ChatConversation from "./ChatConversation"
import { initialThreads, peerImage } from "./chatData"
import type { ChatContext, ChatThread } from "./chatTypes"

function mergeThread(threads: ChatThread[], ctx: ChatContext | null): ChatThread[] {
  if (!ctx?.threadId) return threads
  const existing = threads.find((t) => t.threadId === ctx.threadId)
  const next: ChatThread = existing
    ? { ...existing, ...ctx, lastMessage: ctx.draft || existing.lastMessage }
    : {
      ...ctx,
      lastMessage: ctx.draft || "New conversation",
      time: "now",
      messages: ctx.draft ? [{ id: "draft", fromMe: true, text: ctx.draft }] : [],
    }
  return [next, ...threads.filter((t) => t.threadId !== ctx.threadId)]
}

function Chat() {
  const location = useLocation()
  const [params] = useSearchParams()
  const ctx = (location.state as ChatContext | null) || null
  const [threads, setThreads] = useState(initialThreads)
  const [activeId, setActiveId] = useState<string | null>(params.get("thread") || ctx?.threadId || null)

  useEffect(() => {
    const incoming = (location.state as ChatContext | null) || null
    const id = params.get("thread") || incoming?.threadId || null
    setThreads((prev) => mergeThread(prev, incoming))
    setActiveId(id)
  }, [location.state, params])

  const active = useMemo(
    () => threads.find((t) => t.threadId === activeId) || null,
    [threads, activeId]
  )

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-4 pb-4">
          <div className={`col-span-full lg:col-span-3 ${active ? "hidden lg:block" : ""}`}>
            <div className="flex flex-col h-[calc(100dvh-11rem)] bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="font-bold text-lg">Chats</div>
                <div className="text-sm text-muted">Messages about your listings and rentals</div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {threads.map((thread) => (
                  <button
                    key={thread.threadId}
                    type="button"
                    onClick={() => setActiveId(thread.threadId)}
                    className={`w-full text-left px-4 py-3 flex gap-3 border-b border-gray-100 cursor-pointer ${activeId === thread.threadId ? "bg-surface" : "hover:bg-surface"}`}
                  >
                    <div className="relative">
                      <img src={peerImage} alt="" className="size-12 rounded-full object-cover" />
                      <img src={thread.listingImage} alt="" className="size-5 rounded object-cover absolute -bottom-0.5 -right-0.5 border border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <div className="font-semibold truncate">{thread.peerName}</div>
                        <div className="text-xs text-muted shrink-0">{thread.time}</div>
                      </div>
                      <div className="text-xs text-muted truncate">{thread.listingTitle}</div>
                      <div className="text-sm text-muted truncate">{thread.lastMessage}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-full lg:col-span-6">
            {active ? (
              <ChatConversation thread={active} onBack={() => setActiveId(null)} />
            ) : (
              <div className="hidden lg:flex h-[calc(100dvh-11rem)] items-center justify-center text-muted bg-white rounded-2xl">
                Select a chat
              </div>
            )}
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Chat
