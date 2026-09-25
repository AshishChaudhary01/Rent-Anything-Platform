import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { IoCalendarOutline, IoCardOutline, IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import RentFlowLeave from "../RentFlowLeave"
import { RENT_STEPS } from "../returnSteps"
import { raToast } from "../../../../lib/raToast"
import { useCancelRental, usePaymentConfig, useRental } from "../../../../hooks/queries/useRentals"
import RaButton from "../../../../components/button/RaButton"
import { initiatePayment, submitEsewaForm } from "../../../../services/rental.service"
import { esewa } from "../../../../utils/images"

function Checkout() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const failed = params.get("failed")
  const { data: rental, isPending } = useRental(rentalId)
  const { data: config } = usePaymentConfig()
  const cancelRental = useCancelRental()
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!failed) return
    const key = `pay-fail-toast-${rentalId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, "1")
    raToast.error("Payment was cancelled or failed")
  }, [failed, rentalId])

  useEffect(() => {
    if (!rental) return
    if (rental.status === "REQUESTED") {
      navigate(`/user/rent/waiting?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "PAID") {
      navigate(`/user/rent/confirmation?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "ACTIVE") {
      navigate(`/user/rent/confirmation?rentalId=${rental.id}`, { replace: true })
    }
  }, [rental, navigate])

  const pay = async () => {
    if (!rental) return
    if (!config?.esewa) {
      raToast.error("eSewa is not available right now")
      return
    }
    setPaying(true)
    try {
      const initiated = await initiatePayment(rental.id, { gateway: "ESEWA" })
      if (initiated.formAction && initiated.formFields) {
        submitEsewaForm(initiated.formAction, initiated.formFields)
        return
      }
      raToast.error("Could not start eSewa payment")
    } catch (error) {
      raToast.fromError(error, "Could not start payment")
    } finally {
      setPaying(false)
    }
  }

  if (!rentalId) {
    return <p className="px-6 py-10 text-muted">Missing rental. Start from a listing.</p>
  }
  if (isPending || !rental) {
    return <p className="px-6 py-10 text-muted">Loading checkout…</p>
  }

  const remaining = rental.status === "MEETUP_CONFIRMED"
  const amount = remaining ? Number(rental.remainingDue ?? 0) : Number(rental.commitmentFee)

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={remaining ? 4 : 1} title="Rent Item" steps={RENT_STEPS} />

          <div>
            <div className="text-xl font-bold">{remaining ? "Pay remaining rent" : "Pay commitment"}</div>
            <div className="text-sm md:text-base font-light text-muted">
              {remaining
                ? "Meetup is confirmed. Pay the remaining rental fee so this rental can start."
                : "Pay a small commitment fee. This builds trust between renter and owner."}
            </div>
          </div>

          <RentHint
            icon={<IoShieldCheckmarkOutline className="size-6" />}
            title={remaining ? "Starts after this payment" : "Held until the rental is done"}
            tone="warning"
          >
            {remaining
              ? "Commitment already paid is credited. Deposit is still due at pickup and refunded on a clean return."
              : "RAP holds this fee until pickup QR. After scan you pay remaining rent to start. Deposit is due at pickup."}
          </RentHint>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex gap-x-4">
              {rental.listingImage ? (
                <img src={rental.listingImage} alt="" className="size-16 rounded-lg object-cover" />
              ) : (
                <div className="size-16 rounded-lg bg-surface" />
              )}
              <div>
                <div className="font-semibold">{rental.listingTitle}</div>
                <div className="text-sm text-muted">Nrs. {Number(rental.dailyRate).toLocaleString()} / day</div>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Dates</div>
              <div className="font-medium">{rental.startDate} – {rental.endDate}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium text-right max-w-[60%]">{rental.meetupLocation}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex justify-between text-muted">
              <span>{remaining ? "Remaining rent" : "Commitment fee"}</span>
              <span className="font-bold text-inherit">Nrs. {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Pay now</span>
              <span className="text-primary">Nrs. {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{remaining ? "Deposit still due at pickup" : "Due after meetup (remaining rent + deposit)"}</span>
              <span className="font-semibold text-inherit">
                Nrs. {Number(remaining ? rental.deposit : rental.payLater).toLocaleString()}
              </span>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex items-center gap-3">
            <img src={esewa} alt="" className="size-10 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="font-semibold flex items-center gap-2">
                <IoCardOutline className="size-5 text-primary" />
                Pay with eSewa
              </div>
              <div className="text-sm text-muted">Opens eSewa to complete this payment.</div>
            </div>
          </RaCard>

          <RaButton
            type="button"
            btnText={paying ? "Redirecting to eSewa…" : `Pay Nrs. ${amount.toLocaleString()} with eSewa`}
            disabled={!config?.esewa || paying}
            clickFunc={() => void pay()}
          />
          <RentFlowLeave />
          <RaButton
            type="button"
            btnText={cancelRental.isPending ? "Cancelling…" : "Cancel this request"}
            variant="danger"
            disabled={cancelRental.isPending}
            clickFunc={() =>
              cancelRental.mutate(rental.id, {
                onSuccess: () => {
                  raToast.success("Request cancelled")
                  navigate("/user/my-rentals")
                },
                onError: (error) => raToast.fromError(error, "Could not cancel"),
              })
            }
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Checkout
