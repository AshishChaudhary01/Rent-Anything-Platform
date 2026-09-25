import { useState } from "react"
import { Link } from "react-router-dom"
import { IoArrowBackOutline, IoSend } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import ReportLink from "../../../../components/report/ReportLink"
import { useChat, useSendChat } from "../../../../hooks/queries/useChats"
import { raToast } from "../../../../lib/raToast"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function ChatConversation({
  threadId,
  onBack,
}: {
  threadId: string
  onBack?: () => void
}) {
  const { data: thread, isPending } = useChat(threadId)
  const sendChat = useSendChat()
  const [text, setText] = useState("")

  const send = () => {
    const next = text.trim()
    if (!next || !thread) return
    sendChat.mutate(
      { id: thread.id, text: next },
      {
        onSuccess: () => setText(""),
        onError: (error) => raToast.fromError(error, "Could not send"),
      },
    )
  }

  if (isPending || !thread) {
    return <RaPageLoader label="Loading chat…" />
  }

  return (
    <RaCard round="round" styleClass="flex flex-col h-[calc(100dvh-11rem)] p-0! md:p-0! overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        {onBack && (
          <button type="button" onClick={onBack} className="lg:hidden text-muted cursor-pointer">
            <IoArrowBackOutline className="size-5" />
          </button>
        )}
        {thread.peerAvatarUrl ? (
          <img src={thread.peerAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
        ) : (
          <div className="size-10 rounded-full bg-surface" />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{thread.peerName}</div>
          <div className="text-xs text-muted">{thread.peerRole}</div>
        </div>
        <ReportLink
          iconOnly
          btnText={`Report ${thread.peerName}`}
          draft={{
            context: "chat",
            listingTitle: thread.listingTitle,
            listingId: thread.listingId,
            accusedName: thread.peerName,
            accusedId: thread.peerId,
            rentalId: thread.rentalId || undefined,
            reason: "Harassment",
          }}
        />
      </div>

      <Link to={`/user/listing/${thread.listingId}`} className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-surface">
        {thread.listingImage ? (
          <img src={thread.listingImage} alt="" className="size-12 rounded-lg object-cover" />
        ) : (
          <div className="size-12 rounded-lg bg-white" />
        )}
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{thread.listingTitle}</div>
          <div className="text-xs text-muted">{thread.listingRate || "Listing"}</div>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {thread.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-x-3 items-start ${msg.fromMe ? "flex-row-reverse" : ""}`}>
            <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${msg.fromMe ? "bg-primary text-white" : "bg-gray-100"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 border border-muted/20 rounded-full px-4 py-2 outline-0 bg-surface"
        />
        <button type="button" onClick={send} className="bg-primary text-white size-10 rounded-full flex items-center justify-center cursor-pointer">
          <IoSend className="size-4" />
        </button>
      </div>
    </RaCard>
  )
}

export default ChatConversation
