import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import { usePublicListings, usePublicProfile } from "../../../../hooks/queries/usePublicProfile"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

const selectClass = "bg-white border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
const PAGE = 9

function statusLabel(status?: string) {
  if (status === "RENTED") return "Busy"
  if (status === "UNAVAILABLE") return "Paused"
  return "Available"
}

function PublicListings() {
  const { id = "" } = useParams()
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState("ALL")
  const [sort, setSort] = useState("newest")
  const { data: profile } = usePublicProfile(id)
  const { data, isPending } = usePublicListings(id, { page, size: PAGE, status, sort })
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE))

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-6 pb-10">
          <RaBreadcrumb items={[
            { label: profile?.fullName || "Profile", path: `/user/people/${id}` },
            { label: "Listings" },
          ]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Listings</div>
            <div className="text-sm text-muted">
              {profile ? `${profile.fullName} · ${profile.listingCount} listing${profile.listingCount === 1 ? "" : "s"}` : "All listings from this member."}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <select className={selectClass} value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
              <option value="ALL">All listings</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Busy / rented</option>
              <option value="UNAVAILABLE">Paused</option>
            </select>
            <select className={selectClass} value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price">Price: High</option>
            </select>
          </div>
          {isPending ? (
            <RaPageLoader label="Loading listings…" />
          ) : (data?.items.length ?? 0) === 0 ? (
            <p className="text-muted py-8 text-center">No listings match these filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.items.map((item) => (
                <Link key={item.id} to={`/user/listing/${item.id}`}>
                  <RaCard round="round" styleClass="flex gap-3 p-3! h-full">
                    <img src={item.image} alt="" className="size-20 rounded-lg object-cover shrink-0 bg-surface" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold truncate">{item.title}</div>
                        <RaBadge badgeText={statusLabel(item.status)} size="sm" variant={item.status === "AVAILABLE" ? "success" : "warning"} />
                      </div>
                      <div className="text-xs text-muted truncate">{item.location}</div>
                      <div className="text-sm font-bold text-primary mt-1">Nrs. {Number(item.dailyRate).toLocaleString()} / day</div>
                    </div>
                  </RaCard>
                </Link>
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

export default PublicListings
