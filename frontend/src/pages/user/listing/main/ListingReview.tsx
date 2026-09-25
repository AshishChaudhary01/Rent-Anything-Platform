import { Link } from "react-router-dom"
import { useListingReviews } from "../../../../hooks/queries/useRentals"
import StarRating from "../../../../components/rating/StarRating"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function ListingReview({ listingId }: { listingId?: string }) {
  const { data, isPending } = useListingReviews(listingId)

  if (!listingId) return null

  const average = data?.average ?? 0
  const count = data?.count ?? 0
  const items = data?.items ?? []
  const mine = items.filter((review) => review.mine)
  const others = items.filter((review) => !review.mine)

  return (
    <div className="flex flex-col gap-y-6 p-6 font-light bg-white rounded-2xl shadow-xs">
      <div>
        <p className="text-lg md:text-2xl font-bold">Reviews</p>
        {isPending ? (
          <RaPageLoader label="Loading reviews…" />
        ) : count === 0 ? (
          <p className="text-sm text-muted mt-1">No reviews yet. Ratings appear after completed rentals.</p>
        ) : (
          <div className="flex gap-x-4 items-center mt-1">
            <span className="text-primary font-bold text-xl">{average.toFixed(1)}</span>
            <StarRating value={average} readOnly size="sm" />
            <span className="text-muted">({count} review{count === 1 ? "" : "s"})</span>
          </div>
        )}
      </div>
      {mine.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="font-bold">Your review</div>
          {mine.map((review) => (
            <div key={review.id} className="rounded-2xl bg-soft-warning/40 p-4 border border-warning/30">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-bold">You</div>
                <StarRating value={review.rating} readOnly size="sm" showValue />
              </div>
              <div className="text-sm text-muted mb-2">{new Date(review.createdAt).toLocaleDateString()}</div>
              {review.comment && <div className="mb-3">{review.comment}</div>}
              <Link to={`/user/rent/rate?rentalId=${review.rentalId}`} className="text-sm font-semibold text-primary">
                Edit review
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-y-4">
        {others.map((review) => (
          <div key={review.id} className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center justify-between gap-3 mb-2">
              <Link to={`/user/people/${review.authorId}`} className="font-bold hover:text-primary">
                {review.authorName}
              </Link>
              <StarRating value={review.rating} readOnly size="sm" showValue />
            </div>
            <div className="text-sm text-muted mb-2">{new Date(review.createdAt).toLocaleDateString()}</div>
            {review.comment && <div>{review.comment}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListingReview
