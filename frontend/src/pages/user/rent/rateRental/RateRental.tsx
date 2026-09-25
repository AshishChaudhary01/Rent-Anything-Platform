import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import StarRating from "../../../../components/rating/StarRating"
import { raToast } from "../../../../lib/raToast"
import ReportLink from "../../../../components/report/ReportLink"
import { useRental, useSubmitReview } from "../../../../hooks/queries/useRentals"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function RateRental() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)
  const submit = useSubmitReview()
  const isOwner = Boolean(rental?.owner)
  const peerName = rental ? (isOwner ? rental.renterName : rental.ownerName) : "the other person"
  const donePath = isOwner ? `/user/request-details/${rentalId}` : "/user/my-rentals"
  const editing = Boolean(rental?.myRating)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (!rental) return
    if (rental.myRating) setRating(rental.myRating)
    if (rental.myComment) setComment(rental.myComment)
  }, [rental])

  if (!rentalId) {
    return <p className="px-6 py-10 text-muted">Choose a completed rental to rate.</p>
  }
  if (isPending || !rental) {
    return <RaPageLoader label="Loading rental…" />
  }

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <div className="text-center space-y-3">
            {(isOwner ? rental.renterAvatarUrl : rental.ownerAvatarUrl) ? (
              <img src={(isOwner ? rental.renterAvatarUrl : rental.ownerAvatarUrl) || ""} alt="" className="size-20 rounded-full object-cover mx-auto" />
            ) : (
              <div className="size-20 rounded-full bg-surface mx-auto" />
            )}
            <div>
              <div className="text-xl font-bold">{editing ? `Edit your review of ${peerName}` : `Rate ${peerName}`}</div>
              <div className="text-sm text-muted">
                {isOwner
                  ? "How was this renter? Rate communication, care of the item, and pickup."
                  : "How was this owner and listing? Rate communication, item condition, and handover."}
              </div>
            </div>
          </div>

          <RaCard round="round" bg="accent" styleClass="flex gap-3 items-center p-4!">
            <img src={rental.listingImage} alt="" className="size-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{rental.listingTitle}</div>
              <div className="text-sm text-muted">Nrs. {Number(rental.dailyRate).toLocaleString()} / day</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-4 items-center">
            <div className="text-sm text-muted">Tap a star to rate 1 to 5</div>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && <div className="font-semibold text-primary">{rating} / 5</div>}
            <textarea
              className="w-full min-h-24 bg-surface border border-muted/20 rounded-2xl p-3 outline-none text-sm placeholder:text-muted/50"
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </RaCard>

          <RaButton
            type="button"
            btnText={submit.isPending ? "Saving…" : editing ? "Save changes" : "Submit review"}
            disabled={rating < 1 || submit.isPending}
            clickFunc={() =>
              submit.mutate(
                { id: rental.id, rating, comment: comment.trim() || undefined },
                {
                  onSuccess: () => {
                    raToast.success(editing ? "Review updated" : "Review submitted")
                    navigate(isOwner ? donePath : `/user/listing/${rental.listingId}`)
                  },
                  onError: (error) => raToast.fromError(error, "Could not save review"),
                },
              )
            }
          />
          <Link to={isOwner ? donePath : `/user/listing/${rental.listingId}`} className="text-center text-sm text-muted">
            {editing ? "Back to listing" : "Skip for now"}
          </Link>
          <ReportLink
            draft={{
              context: "rental",
              listingTitle: rental.listingTitle,
              listingId: rental.listingId,
              accusedName: peerName,
              accusedId: isOwner ? rental.renterId : rental.ownerId,
              rentalId: rental.id,
            }}
            btnText="Report an issue instead"
            variant="lean"
            widthFill
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default RateRental
