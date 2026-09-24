import { Link } from "react-router-dom"
import { IoClose } from "react-icons/io5"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ChatLink from "../chat/ChatLink"
import { raToast } from "../../../../lib/raToast"
import { useCancelRental } from "../../../../hooks/queries/useRentals"

export type PendingRental = {
  id: string | number
  image: string
  title: string
  status: string
  rentalStatus?: string
}

function PendingRentalCard({ item }: { item: PendingRental }) {
  const cancelRental = useCancelRental()
  const code = item.rentalStatus || item.status
  const paid = code === "PAID" || item.status.toLowerCase().includes("paid")
  const waiting = code === "REQUESTED" || item.status.toLowerCase().includes("waiting")
  const href = paid
    ? `/user/rent/confirmation?rentalId=${item.id}`
    : waiting
      ? `/user/rent/waiting?rentalId=${item.id}`
      : `/user/rent/checkout?rentalId=${item.id}`

  return (
    <RaCard round="round" bg={waiting ? "warning" : paid ? "success" : "info"} styleClass="flex gap-4 p-4!">
      <Link to={href}>
        <img src={item.image} alt={item.title} className="size-28 md:size-32 rounded-xl object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <Link to={href}>
          <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
          <div className="text-sm text-muted">{item.status}</div>
        </Link>
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <ChatLink rentalId={String(item.id)} btnText="Chat" size="sm" variant="outline" />
          </div>
          {!paid && (
            <div className="flex-1">
              <RaButton
                type="button"
                btnText="Cancel"
                size="sm"
                variant="danger"
                icon={<IoClose />}
                iconPosition="left"
                clickFunc={() =>
                  cancelRental.mutate(String(item.id), {
                    onSuccess: () => raToast.success("Request cancelled"),
                    onError: (error) => raToast.fromError(error, "Could not cancel"),
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </RaCard>
  )
}

export default PendingRentalCard
