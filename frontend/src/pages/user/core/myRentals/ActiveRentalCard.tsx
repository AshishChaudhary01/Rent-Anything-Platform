import { Link } from "react-router-dom"
import { IoTimeOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ChatLink from "../chat/ChatLink"
import { chatWithOwner } from "../chat/chatData"

const detailsPath = "/user/rental-details"

export type ActiveRental = {
  id: number
  image: string
  title: string
  returns: string
  amount: string
}

function ActiveRentalCard({ item }: { item: ActiveRental }) {
  return (
    <RaCard round="round" styleClass="flex gap-4 p-4!">
      <Link to={detailsPath}>
        <img src={item.image} alt={item.title} className="size-32 md:size-40 rounded-xl object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <Link to={detailsPath} className="space-y-1">
          <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
          <div className="flex items-center gap-x-1 text-sm text-muted">
            <IoTimeOutline className="size-4 text-primary" />
            {item.returns}
          </div>
          <div className="font-bold text-primary">{item.amount}</div>
        </Link>
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <ChatLink
              context={{ ...chatWithOwner, threadId: `active-${item.id}`, listingTitle: item.title, listingImage: item.image }}
              btnText="Chat"
              size="sm"
            />
          </div>
          <Link to="/user/rent/return-schedule" className="flex-1">
            <RaButton type="button" btnText="Return Item" size="sm" />
          </Link>
        </div>
      </div>
    </RaCard>
  )
}

export default ActiveRentalCard
