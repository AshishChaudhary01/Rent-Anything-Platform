import { Link } from "react-router-dom"
import { IoClose } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ChatLink from "../chat/ChatLink"
import { chatWithOwner } from "../chat/chatData"

const detailsPath = "/user/rental-details"

export type PendingRental = {
  id: number
  image: string
  title: string
  status: string
}

function PendingRentalCard({ item }: { item: PendingRental }) {
  return (
    <RaCard round="round" styleClass="flex gap-4 p-4!">
      <Link to={detailsPath}>
        <img src={item.image} alt={item.title} className="size-28 md:size-32 rounded-xl object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <Link to={detailsPath}>
          <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
          <div className="text-sm text-muted">{item.status}</div>
        </Link>
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <ChatLink
              context={{ ...chatWithOwner, threadId: `pending-${item.id}`, listingTitle: item.title, listingImage: item.image }}
              btnText="Chat"
              size="sm"
            />
          </div>
          <div className="flex-1">
            <RaButton type="button" btnText="Cancel" size="sm" variant="outline" icon={<IoClose />} iconPosition="left" />
          </div>
        </div>
      </div>
    </RaCard>
  )
}

export default PendingRentalCard
