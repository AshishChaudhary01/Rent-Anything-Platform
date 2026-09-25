import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import StarRating from "../../../../components/rating/StarRating"
import { usePublicProfile, usePublicReviews } from "../../../../hooks/queries/usePublicProfile"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
const PAGE = 6

function PublicReviews() {
  const { id = "" } = useParams()
  const [page, setPage] = useState(0)
  const [rating, setRating] = useState(0)
  const [role, setRole] = useState("ALL")
  const [sort, setSort] = useState("newest")
  const { data: profile } = usePublicProfile(id)
  const { data, isPending } = usePublicReviews(id, { page, size: PAGE, rating, role, sort })
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE))

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-10">
          <RaBreadcrumb items={[
            { label: profile?.fullName || "Profile", path: `/user/people/${id}` },
            { label: "Reviews" },
          ]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Review history</div>
            <div className="text-sm text-muted">
              {profile ? `${profile.fullName} · ${profile.reviewCount} review${profile.reviewCount === 1 ? "" : "s"}` : "All public ratings for this member."}
            </div>
          </div>
          {profile && profile.reviewCount > 0 && (
            <StarRating value={profile.averageRating} readOnly size="sm" showValue />
          )}
          <div className="flex flex-col md:flex-row gap-3">
            <select className={selectClass} value={role} onChange={(e) => { setRole(e.target.value); setPage(0) }}>
              <option value="ALL">All roles</option>
              <option value="OWNER">As lister</option>
              <option value="RENTER">As renter</option>
            </select>
            <select className={selectClass} value={String(rating)} onChange={(e) => { setRating(Number(e.target.value)); setPage(0) }}>
              <option value="0">All stars</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }}>
              <option value="newest">Newest</option>
              <option value="rating">Highest rating</option>
            </select>
          </div>
          {isPending ? (
            <RaPageLoader label="Loading reviews…" />
          ) : (data?.items.length ?? 0) === 0 ? (
            <p className="text-muted py-8 text-center">No reviews match these filters.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data?.items.map((review) => (
                <RaCard key={review.id} round="round" styleClass="flex flex-col sm:flex-row gap-3 p-4!">
                  <img src={review.listingImage} alt="" className="size-16 rounded-lg object-cover shrink-0 bg-surface" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{review.authorName}</div>
                      <StarRating value={review.rating} readOnly size="sm" showValue />
                    </div>
                    <div className="text-xs text-muted">
                      {review.role === "OWNER" ? "As lister" : "As renter"} · {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    {review.comment && <p className="text-sm">{review.comment}</p>}
                    <Link to={`/user/listing/${review.listingId}`} className="text-sm text-primary truncate block">
                      {review.listingTitle}
                    </Link>
                  </div>
                </RaCard>
              ))}
            </div>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-28">
                <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={page === 0} clickFunc={() => setPage(page - 1)} />
              </div>
              <div className="text-sm font-medium">{page + 1} / {pages}</div>
              <div className="w-28">
                <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={page + 1 >= pages} clickFunc={() => setPage(page + 1)} />
              </div>
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default PublicReviews
