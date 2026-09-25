import { IoChatbubbleOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import RaButton, { type IButtonProps } from "../../../../components/button/RaButton"
import { raToast } from "../../../../lib/raToast"
import { useAuthStore } from "../../../../store/authStore"
import { openLoginGate } from "../../../../store/loginGateStore"
import { useOpenChat } from "../../../../hooks/queries/useChats"
import type { ChatContext } from "./chatTypes"

function ChatLink({
  listingId,
  rentalId,
  draft,
  context,
  btnText = "Chat",
  variant = "outline",
  icon = <IoChatbubbleOutline />,
  iconPosition = "left",
  ...rest
}: {
  listingId?: string
  rentalId?: string
  draft?: string
  context?: ChatContext
  btnText?: string
} & Omit<IButtonProps, "clickFunc" | "type" | "btnText">) {
  const navigate = useNavigate()
  const openChat = useOpenChat()
  const token = useAuthStore((s) => s.accessToken)

  return (
    <RaButton
      {...rest}
      type="button"
      btnText={openChat.isPending ? "Opening…" : btnText}
      variant={variant}
      icon={icon}
      iconPosition={iconPosition}
      disabled={rest.disabled || openChat.isPending}
      clickFunc={() => {
        if (!token) {
          openLoginGate({
            message: "Sign in to chat with the other person.",
            next: listingId ? `/user/listing/${listingId}` : "/user/chat",
          })
          return
        }
        if (listingId || rentalId) {
          openChat.mutate(
            { listingId, rentalId, draft },
            {
              onSuccess: (thread) => navigate(`/user/chat?thread=${thread.id}`),
              onError: (error) => raToast.fromError(error, "Could not open chat"),
            },
          )
          return
        }
        if (context?.threadId) {
          navigate(`/user/chat?thread=${context.threadId}`, { state: context })
        }
      }}
    />
  )
}

export default ChatLink
