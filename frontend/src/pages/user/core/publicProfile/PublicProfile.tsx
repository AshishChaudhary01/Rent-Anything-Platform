import { Link, useParams } from "react-router-dom"
import { IoCalendarOutline, IoLocationOutline, IoStarOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import StarRating from "../../../../components/rating/StarRating"
import { usePublicProfile, usePublicReviews } from "../../../../hooks/queries/usePublicProfile"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function joinedLabel(joinedAt?: string | null) {
  if (!joinedAt) return null
  const date = new Date(joinedAt)
  if (Number.isNaN(date.getTime())) return null
  return `Joined ${date.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
}

function PublicProfile() {
  const { id = "" } = useParams()
  const { data: profile, isPending, isError } = usePublicProfile(id)
  const { data: reviews } = usePublicReviews(id, { page: 0, size: 3, sort: "newest" })

  if (isPending) {
    return <RaPageLoader label="Loading profile…" />
  }
  if (isError || !profile) {
    return <p className="px-6 py-10 text-muted">This profile is not available.</p>
  }

  const place = [profile.city, profile.district].filter(Boolean).join(", ")
  const joined = joinedLabel(profile.joinedAt)
  const listingCount = profile.listingCount ?? profile.listings.length

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-10">
          <RaBreadcrumb items={[{ label: profile.fullName }]} />
          <RaCard round="round" styleClass="flex flex-col sm:flex-row gap-4 p-4!">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="size-24 rounded-full object-cover shrink-0" />
            ) : (
              <div className="size-24 rounded-full bg-surface shrink-0" />
            )}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="text-xl md:text-2xl font-bold">{profile.fullName}</div>
              {place && (
                <div className="flex items-center gap-1 text-sm text-muted">
                  <IoLocationOutline className="size-4" />
                  {place}
                </div>
              )}
              {joined && (
                <div className="flex items-center gap-1 text-sm text-muted">
                  <IoCalendarOutline className="size-4" />
                  {joined}
                </div>
              )}
              <StarRating value={profile.averageRating} readOnly size="sm" showValue />
              <div className="text-sm text-muted">
                {profile.reviewCount} review{profile.reviewCount === 1 ? "" : "s"} · {profile.completedAsRenter} rentals as renter · {profile.completedAsOwner} as lister
              </div>
            </div>
          </RaCard>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-lg font-bold">Listings</div>
              {listingCount > 0 && (
                <Link to={`/user/people/${id}/listings`} className="text-sm text-primary">See all</Link>
              )}
            </div>
            {listingCount === 0 ? (
              <p className="text-sm text-muted">No listings yet.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.listings.map((item) => (
                    <Link key={item.id} to={`/user/listing/${item.id}`}>
                      <RaCard round="round" styleClass="flex gap-3 p-3! h-full">
                        <img src={item.image} alt="" className="size-16 rounded-lg object-cover shrink-0 bg-surface" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{item.title}</div>
                          <div className="text-xs text-muted truncate">{item.location}</div>
                          <div className="text-sm font-bold text-primary">Nrs. {Number(item.dailyRate).toLocaleString()} / day</div>
                        </div>
                      </RaCard>
                    </Link>
                  ))}
                </div>
                {listingCount > 3 && (
                  <Link to={`/user/people/${id}/listings`}>
                    <RaButton type="button" btnText="See all listings" variant="secondary" />
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-lg font-bold">Reviews</div>
              {profile.reviewCount > 0 && (
                <Link to={`/user/people/${id}/reviews`} className="text-sm text-primary">See all</Link>
              )}
            </div>
            {profile.reviewCount === 0 ? (
              <p className="text-sm text-muted">No reviews yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {(reviews?.items ?? []).map((review) => (
                  <RaCard key={review.id} round="round" styleClass="flex flex-col gap-2 p-4!">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{review.authorName}</div>
                      <StarRating value={review.rating} readOnly size="sm" showValue />
                    </div>
                    <div className="text-xs text-muted">
                      {review.role === "OWNER" ? "As lister" : "As renter"} · {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    {review.comment && <p className="text-sm">{review.comment}</p>}
                    <Link to={`/user/listing/${review.listingId}`} className="text-sm text-primary truncate">
                      {review.listingTitle}
                    </Link>
                  </RaCard>
                ))}
                {profile.reviewCount > 3 && (
                  <Link to={`/user/people/${id}/reviews`}>
                    <RaButton type="button" btnText="See all reviews" variant="secondary" icon={<IoStarOutline />} iconPosition="left" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default PublicProfile
