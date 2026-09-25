import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { IoArrowForwardOutline, IoCalendarOutline, IoCheckmarkCircle, IoCubeOutline, IoDownloadOutline, IoLocationOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoQrCodeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaBadge from "../../../../components/badge/RaBadge"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import RentFlowLeave from "../RentFlowLeave"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { useRental } from "../../../../hooks/queries/useRentals"
import { downloadReceipt } from "../../../../services/rental.service"
import { raToast } from "../../../../lib/raToast"

function Confirmation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)

  useEffect(() => {
    if (!rentalId) navigate("/user", { replace: true })
  }, [rentalId, navigate])

  useEffect(() => {
    if (!rental) return
    if (rental.status === "REQUESTED") {
      navigate(`/user/rent/waiting?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "PENDING_PAYMENT" || rental.status === "CANCELLED") {
      navigate(`/user/rent/checkout?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "MEETUP_CONFIRMED") {
      navigate(`/user/rent/checkout?rentalId=${rental.id}&phase=remaining`, { replace: true })
    }
  }, [rental, navigate])

  if (isPending || !rental) {
    return <p className="px-6 py-10 text-muted">Loading confirmation…</p>
  }

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={rental.status === "ACTIVE" ? 4 : 2} title="Rent Item" steps={RENT_STEPS} />

          <div className="text-center space-y-2">
            <IoCheckmarkCircle className="size-14 mx-auto text-success" />
            <div className="text-xl font-bold">{rental.status === "ACTIVE" ? "Rental started" : "Booking Confirmed"}</div>
            <div className="text-sm md:text-base font-light text-muted">
              {rental.status === "ACTIVE"
                ? "Remaining rent is paid. The rental is now active."
                : "Commitment received. Meet the owner, scan QR, then pay remaining rent to start."}
            </div>
          </div>

          <RentHint icon={<IoQrCodeOutline className="size-6" />} title={rental.status === "ACTIVE" ? "Item is with you" : "Next: scan at pickup"} tone="success">
            {rental.status === "ACTIVE"
              ? "Return later from My rentals. Download your payment receipt below."
              : "The rental starts only after pickup QR and remaining payment."}
          </RentHint>

          <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCubeOutline className="size-5 text-primary" />
              Listing
            </div>
            <div className="flex gap-x-4">
              {rental.listingImage ? (
                <img src={rental.listingImage} alt="" className="size-16 rounded-lg object-cover" />
              ) : (
                <div className="size-16 rounded-lg bg-white" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{rental.listingTitle}</div>
                  <RaBadge badgeText={rental.status === "ACTIVE" ? "Active" : "Paid"} size="sm" />
                </div>
                <div className="text-sm text-muted">
                  {rental.status === "ACTIVE"
                    ? `Nrs. ${Number(rental.rentalTotal).toLocaleString()} rental paid`
                    : `Nrs. ${Number(rental.commitmentFee).toLocaleString()} held as commitment`}
                </div>
              </div>
            </div>
          </RaCard>

          <RaCard round="round" bg="info" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-info" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-info" /> Dates</div>
              <div className="font-medium">{rental.startDate} – {rental.endDate}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-info" /> Location</div>
              <div className="font-medium text-right max-w-[60%]">{rental.meetupLocation}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoPersonOutline className="size-5 text-primary" />
              Owner
            </div>
            <div className="flex items-center gap-x-3">
              {rental.ownerAvatarUrl ? (
                <img src={rental.ownerAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
              ) : (
                <div className="size-10 rounded-full bg-surface" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{rental.ownerName}</div>
                <div className="text-sm text-muted">Coordinate pickup</div>
              </div>
              <ChatLink rentalId={rental.id} size="sm" widthFill={false} />
            </div>
          </RaCard>

          <RentHint icon={<IoShieldCheckmarkOutline className="size-6" />} title="Fee is held, not paid out" tone="warning">
            {rental.escrowNote || "RAP holds the commitment fee until the rental is completed."}
          </RentHint>

          {rental.status !== "ACTIVE" && (
            <RaButton
              type="button"
              btnText="Go to meetup / scan QR"
              variant="primary"
              icon={<IoArrowForwardOutline />}
              clickFunc={() => navigate(`/user/rent/meetup?rentalId=${rental.id}`)}
            />
          )}
          <RaButton
            type="button"
            btnText="Download commitment receipt"
            variant="secondary"
            icon={<IoDownloadOutline />}
            iconPosition="left"
            clickFunc={() => {
              void downloadReceipt(rental.id, "COMMITMENT").catch((error) => raToast.fromError(error, "Could not download receipt"))
            }}
          />
          {rental.status === "ACTIVE" && Number(rental.rentalTotal) > Number(rental.commitmentFee) && (
            <RaButton
              type="button"
              btnText="Download rent receipt"
              variant="outline"
              icon={<IoDownloadOutline />}
              iconPosition="left"
              clickFunc={() => {
                void downloadReceipt(rental.id, "RENT").catch((error) => raToast.fromError(error, "Could not download receipt"))
              }}
            />
          )}
          <RentFlowLeave owner={rental.owner} listingId={rental.listingId} rentalId={rental.id} />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Confirmation
