import { useNavigate } from "react-router-dom"
import { IoChatbubbleOutline } from "react-icons/io5"
import RaButton, { type IButtonProps } from "../../../../components/button/RaButton"
import type { ChatContext } from "./chatTypes"

function ChatLink({
  context,
  btnText = "Chat",
  variant = "outline",
  icon = <IoChatbubbleOutline />,
  iconPosition = "left",
  ...rest
}: { context: ChatContext; btnText?: string } & Omit<IButtonProps, "clickFunc" | "type" | "btnText">) {
  const navigate = useNavigate()

  return (
    <RaButton
      {...rest}
      type="button"
      btnText={btnText}
      variant={variant}
      icon={icon}
      iconPosition={iconPosition}
      clickFunc={() => navigate(`/user/chat?thread=${context.threadId}`, { state: context })}
    />
  )
}

export default ChatLink
