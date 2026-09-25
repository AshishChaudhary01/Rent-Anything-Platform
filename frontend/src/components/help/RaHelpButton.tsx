import { IoHelpCircleOutline } from "react-icons/io5"
import { openHelp } from "../../store/helpStore"

function RaHelpButton({
  topicId,
  className = "size-6 text-muted hover:text-primary",
}: {
  topicId?: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label="Open help"
      className={`${className} cursor-pointer`}
      onClick={() => openHelp(topicId)}
    >
      <IoHelpCircleOutline className="size-full" />
    </button>
  )
}

export default RaHelpButton
