import { Link } from "react-router-dom"
import { IoTimeOutline } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ChatLink from "../chat/ChatLink"

export type ActiveRental = {
  id: string | number
  image: string
  title: string
  returns: string
  amount: string
  returnScheduled?: boolean
}

function ActiveRentalCard({ item }: { item: ActiveRental }) {
  const href = item.returnScheduled
    ? `/user/rent/return-meetup?rentalId=${item.id}`
    : `/user/rent/return-schedule?rentalId=${item.id}`

  return (
    <RaCard round="round" bg="warning" styleClass="flex gap-4 p-4!">
      <Link to={`/user/rental-details?rentalId=${item.id}`}>
        <img src={item.image} alt={item.title} className="size-32 md:size-40 rounded-xl object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <Link to={`/user/rental-details?rentalId=${item.id}`} className="space-y-1">
          <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
          <div className="flex items-center gap-x-1 text-sm text-muted">
            <IoTimeOutline className="size-4 text-primary" />
            {item.returns}
          </div>
          <div className="font-bold text-primary">{item.amount}</div>
        </Link>
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <ChatLink rentalId={String(item.id)} btnText="Chat" size="sm" variant="outline" />
          </div>
          <div className="flex-1">
            <Link to={href}>
              <RaButton type="button" btnText={item.returnScheduled ? "Return meetup" : "Start return"} size="sm" variant="success" />
            </Link>
          </div>
        </div>
      </div>
    </RaCard>
  )
}

export default ActiveRentalCard
