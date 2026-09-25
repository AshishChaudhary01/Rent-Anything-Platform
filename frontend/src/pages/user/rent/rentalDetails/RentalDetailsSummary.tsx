import { Link } from "react-router-dom"
import { IoCashOutline, IoLocationOutline, IoShieldCheckmarkOutline, IoStarOutline, IoTimeOutline } from "react-icons/io5"
import RaButton from "../../../../components/button/RaButton"
import RaCard from "../../../../components/card/RaCard"
import RaMapView from "../../../../components/maps/RaMapView"
import ReportLink from "../../../../components/report/ReportLink"
import { downloadReceipt } from "../../../../services/rental.service"
import { raToast } from "../../../../lib/raToast"
import type { Rental } from "../../../../types/rental.types"

function RentalDetailsSummary({ rental }: { rental: Rental }) {
  const peerName = rental.owner ? rental.renterName : rental.ownerName
  const peerId = rental.owner ? rental.renterId : rental.ownerId
  const hasMap = rental.meetupLatitude != null && rental.meetupLongitude != null

  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-4">
        <div className="font-bold text-lg">Rental summary</div>

        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-xs text-muted">PICK UP</div>
            <div className="font-bold">{rental.startDate}</div>
          </div>
          <div className="text-xs font-bold text-primary flex items-center gap-1">
            <IoTimeOutline /> {rental.days} DAYS
          </div>
          <div>
            <div className="text-xs text-muted">RETURN</div>
            <div className="font-bold">{rental.endDate}</div>
          </div>
        </div>

        <div className="flex justify-between text-muted">
          <span className="flex items-center gap-1"><IoCashOutline className="size-4 text-primary" /> Cost per day</span>
          <span className="font-semibold text-inherit">Nrs. {Number(rental.dailyRate).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Rental total</span>
          <span className="font-semibold text-inherit">Nrs. {Number(rental.rentalTotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Commitment held</span>
          <span className="font-semibold text-inherit">Nrs. {Number(rental.commitmentFee).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Commitment applied to total</span>
          <span className="font-semibold text-inherit">Nrs. {Number(rental.commitmentApplied ?? rental.commitmentFee).toLocaleString()}</span>
        </div>
        {rental.platformCommission != null && (
          <div className="flex justify-between text-muted">
            <span>Platform commission</span>
            <span className="font-semibold text-inherit">Nrs. {Number(rental.platformCommission).toLocaleString()}</span>
          </div>
        )}
        {rental.ownerPayout != null && (
          <div className="flex justify-between text-muted">
            <span>Lister payout</span>
            <span className="font-semibold text-inherit">Nrs. {Number(rental.ownerPayout).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold">
          <span>{rental.remainingPaid ? "Deposit due at pickup" : "Due to start (remaining rent + deposit)"}</span>
          <span className="text-primary">Nrs. {Number(rental.payLater).toLocaleString()}</span>
        </div>

        <div className="flex gap-x-2">
          <IoLocationOutline className="size-5 text-primary shrink-0" />
          <div>
            <div className="font-semibold">Meetup location</div>
            <div className="text-sm text-muted">{rental.meetupLocation}</div>
          </div>
        </div>

        {rental.status === "REQUESTED" && rental.renter && (
          <Link to={`/user/rent/waiting?rentalId=${rental.id}`}>
            <RaButton type="button" btnText="Continue request" variant="secondary" />
          </Link>
        )}
        {rental.status === "REQUESTED" && rental.owner && (
          <Link to={`/user/request-details/${rental.id}`}>
            <RaButton type="button" btnText="Review request" variant="secondary" />
          </Link>
        )}
        {rental.status === "PENDING_PAYMENT" && rental.renter && (
          <Link to={`/user/rent/checkout?rentalId=${rental.id}`}>
            <RaButton type="button" btnText="Pay commitment fee" />
          </Link>
        )}
        {rental.status === "PAID" && (
          <Link to={`/user/rent/meetup?rentalId=${rental.id}`}>
            <RaButton type="button" btnText="Go to meetup / scan QR" variant="camera" />
          </Link>
        )}
        {rental.status === "MEETUP_CONFIRMED" && rental.renter && (
          <Link to={`/user/rent/checkout?rentalId=${rental.id}&phase=remaining`}>
            <RaButton type="button" btnText="Pay remaining rent" />
          </Link>
        )}
        {rental.status === "MEETUP_CONFIRMED" && rental.owner && (
          <div className="text-sm text-muted">Waiting for the renter to pay remaining rent.</div>
        )}
        {rental.status === "ACTIVE" && (
          <Link to={rental.returnScheduled ? `/user/rent/return-meetup?rentalId=${rental.id}` : `/user/rent/return-schedule?rentalId=${rental.id}`}>
            <RaButton type="button" btnText={rental.returnScheduled ? "Continue return meetup" : "Start return"} variant="success" />
          </Link>
        )}
        {(rental.status === "PAID" || rental.status === "MEETUP_CONFIRMED" || rental.status === "ACTIVE" || rental.status === "COMPLETED") && (
          <RaButton
            type="button"
            btnText="Download commitment receipt"
            variant="outline"
            clickFunc={() => {
              void downloadReceipt(rental.id, "COMMITMENT").catch((error) => raToast.fromError(error, "Could not download receipt"))
            }}
          />
        )}
        {(rental.status === "ACTIVE" || rental.status === "COMPLETED") && (
          <RaButton
            type="button"
            btnText="Download rent receipt"
            variant="outline"
            clickFunc={() => {
              void downloadReceipt(rental.id, "RENT").catch((error) => raToast.fromError(error, "Could not download receipt"))
            }}
          />
        )}
        {rental.canReview && (
          <Link to={`/user/rent/rate?rentalId=${rental.id}`}>
            <RaButton type="button" btnText={rental.myRating ? "Edit review" : "Leave a review"} variant="secondary" icon={<IoStarOutline />} iconPosition="left" />
          </Link>
        )}
        <ReportLink
          draft={{
            context: "rental",
            listingTitle: rental.listingTitle,
            listingId: rental.listingId,
            accusedName: peerName,
            accusedId: peerId,
            rentalId: rental.id,
          }}
          btnText="Report an issue"
          variant="lean"
          widthFill
        />

        <div className="flex gap-x-2 text-sm text-muted">
          <IoShieldCheckmarkOutline className="size-4 text-success shrink-0 mt-0.5" />
          {rental.escrowNote || "RAP holds the commitment fee until the rental is completed."}
        </div>
      </RaCard>

      {hasMap && (
        <RaMapView center={{ lat: rental.meetupLatitude as number, lng: rental.meetupLongitude as number, label: rental.meetupLocation }} />
      )}
    </div>
  )
}

export default RentalDetailsSummary
