import RaCard from "../../../../../components/card/RaCard"
import Divider from "../../../../../components/divider/Divider"
import RaButton from "../../../../../components/button/RaButton"
import { useNavigate } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import type { Listing } from "../../../../../types/listing.types"
import type { RequestToRentFormValue } from "../form/RequestToRentForm"
import { usePaymentConfig } from "../../../../../hooks/queries/useRentals"

function rentalDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 0
  return diff + 1
}

function RequestToRentSummaryCard({
  listing,
  formData,
  onContinue,
  loading,
}: {
  listing: Listing
  formData: RequestToRentFormValue
  onContinue: () => void
  loading?: boolean
}) {
  const { data: config } = usePaymentConfig()
  const days = rentalDays(formData.startDate, formData.endDate)
  const navigate = useNavigate()
  const dailyRate = Number(listing.dailyRate)
  const rental = days * dailyRate
  const commitmentFee = Number(config?.commitmentFee ?? 100)
  const deposit = Number(listing.deposit)
  const subtotal = rental + commitmentFee + deposit
  const payNow = commitmentFee
  const payLater = rental + deposit
  const ready = days >= 1 && Boolean(formData.meetupLocation)

  return (
    <RaCard styleClass="flex flex-col gap-y-4">
      <div className="font-medium flex gap-x-4 justify-between lg:justify-start items-center">
        <p className="text-base lg:text-2xl font-bold truncate">
          {listing.title}
        </p>

        <div className="lg:hidden text-base md:text-lg gap-x-2 flex justify-between">
          <div className="flex items-center">
            <p>Now: <span className="font-bold text-primary">{payNow}</span></p>
          </div>
          <RaButton
            type="button"
            btnText={loading ? "Sending…" : "Send request"}
            size="large"
            disabled={!ready || loading}
            clickFunc={onContinue}
          />
        </div>
      </div>
      <Divider />

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>
              Rental (Nrs. {dailyRate} / day × {days})
            </p>
          </div>
          <p className="font-bold">Nrs. {rental.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>Commitment fee (for trust)</p>
          </div>
          <p className="font-bold">Nrs. {commitmentFee}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>Security deposit (refundable)</p>
          </div>
          <p className="font-bold">Nrs. {deposit.toLocaleString()}</p>
        </div>
        <div className="flex justify-between my-2">
          <div className="flex gap-x-2 items-center text-xl font-semibold">
            <p>Sub total:</p>
          </div>
          <p className="font-bold">Nrs. {subtotal.toLocaleString()}</p>
        </div>
      </div>
      <Divider />

      <div className="flex text-gray-600 justify-between gap-x-4 items-center text-lg">
        <div>Pay later: </div>
        <div>Nrs. {payLater.toLocaleString()}</div>
      </div>
      <div className="flex justify-between gap-x-4 items-center text-2xl font-semibold">
        <div>Pay now: </div>
        <div>Nrs. {payNow}</div>
      </div>

      <div className="hidden lg:flex flex-col gap-2">
        <RaButton
          type="button"
          btnText={loading ? "Sending…" : "Send request"}
          size="large"
          disabled={!ready || loading}
          clickFunc={onContinue}
        />
        <RaButton
          type="button"
          btnText="Back to listing"
          variant="ghost"
          icon={<IoArrowBackOutline />}
          iconPosition="left"
          clickFunc={() => navigate(`/user/listing/${listing.id}`)}
        />
      </div>
      <div className="text-center text-muted font-light text-sm">
        The owner accepts first. Then you pay the commitment with a linked eSewa wallet. Rental and deposit are due at pickup.
      </div>
    </RaCard>
  )
}

export default RequestToRentSummaryCard
