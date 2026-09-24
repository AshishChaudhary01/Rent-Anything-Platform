import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import ChatConversation from "./ChatConversation"
import { useChats } from "../../../../hooks/queries/useChats"

function Chat() {
  const [params] = useSearchParams()
  const { data: threads = [], isPending } = useChats()
  const [activeId, setActiveId] = useState<string | null>(params.get("thread"))

  useEffect(() => {
    setActiveId(params.get("thread"))
  }, [params])

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId],
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
                {isPending && <p className="px-4 py-6 text-sm text-muted">Loading chats…</p>}
                {!isPending && threads.length === 0 && (
                  <p className="px-4 py-6 text-sm text-muted">No conversations yet.</p>
                )}
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    className={`w-full text-left px-4 py-3 flex gap-3 border-b border-gray-100 cursor-pointer ${activeId === thread.id ? "bg-surface" : "hover:bg-surface"}`}
                  >
                    <div className="relative">
                      {thread.peerAvatarUrl ? (
                        <img src={thread.peerAvatarUrl} alt="" className="size-12 rounded-full object-cover" />
                      ) : (
                        <div className="size-12 rounded-full bg-surface" />
                      )}
                      {thread.listingImage && (
                        <img src={thread.listingImage} alt="" className="size-5 rounded object-cover absolute -bottom-0.5 -right-0.5 border border-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <div className="font-semibold truncate">{thread.peerName}</div>
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
            {activeId ? (
              <ChatConversation threadId={activeId} onBack={() => setActiveId(null)} />
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
