import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { IoChatbubbleOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import RentFlowLeave from "../RentFlowLeave"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { raToast } from "../../../../lib/raToast"
import { runConfirmedAction } from "../../../../lib/criticalAction"
import { useCancelRental, useRental } from "../../../../hooks/queries/useRentals"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function RequestWaiting() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId, 4000)
  const cancelRental = useCancelRental()

  useEffect(() => {
    if (!rental) return
    if (rental.status === "PENDING_PAYMENT") {
      raToast.success("The owner accepted. Pay the commitment fee to continue.")
      navigate(`/user/rent/checkout?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "MEETUP_CONFIRMED") {
      navigate(`/user/rent/checkout?rentalId=${rental.id}&phase=remaining`, { replace: true })
      return
    }
    if (rental.status === "PAID" || rental.status === "ACTIVE") {
      navigate(`/user/rent/confirmation?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "DECLINED" || rental.status === "CANCELLED") {
      raToast.warning(rental.status === "DECLINED" ? "The owner declined this request" : "This request was cancelled")
      navigate("/user/my-rentals", { replace: true })
    }
  }, [rental, navigate])

  if (!rentalId) return <p className="px-6 py-10 text-muted">Missing request.</p>
  if (isPending || !rental) return <RaPageLoader label="Loading request…" />

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={0} title="Rent Item" steps={RENT_STEPS} />

          <div>
            <div className="text-xl font-bold">Waiting for the owner</div>
            <div className="text-sm text-muted">
              Stay on this page. When {rental.ownerName} accepts, you continue to payment automatically.
            </div>
          </div>

          <RentHint icon={<IoTimeOutline className="size-6" />} title="Request sent" tone="warning">
            You only pay after the owner accepts. Chat if you need to change dates or the meetup place.
          </RentHint>

          <RaCard round="round" styleClass="flex gap-4 items-center">
            <img src={rental.listingImage} alt="" className="size-16 rounded-lg object-cover" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{rental.listingTitle}</div>
              <div className="text-sm text-muted">{rental.startDate} – {rental.endDate} · {rental.days} day{rental.days === 1 ? "" : "s"}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoChatbubbleOutline className="size-5 text-primary" />
              Owner
            </div>
            <ChatLink rentalId={rental.id} btnText={`Chat with ${rental.ownerName}`} />
          </RaCard>

          <RaButton
            type="button"
            btnText={cancelRental.isPending ? "Cancelling…" : "Cancel request"}
            variant="danger"
            disabled={cancelRental.isPending}
            clickFunc={() =>
              void runConfirmedAction({
                confirm: {
                  title: "Cancel this request?",
                  body: "The owner will be notified. You will need to send a new request later.",
                  confirmText: "Cancel request",
                  danger: true,
                },
                run: () => cancelRental.mutateAsync(rental.id),
                success: "Request cancelled",
              }).then((ok) => {
                if (ok) navigate("/user/my-rentals")
              })
            }
          />
          <RentFlowLeave />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default RequestWaiting
