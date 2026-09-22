import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import { useAdminStore } from "../../../store/adminStore"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"
import { profile01 } from "../../../utils/images"

function AdminKyc() {
  const kycCases = useAdminStore((s) => s.kycCases)
  const [params, setParams] = useSearchParams()
  const status = params.get("status") || "All"
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return kycCases.filter((item) => {
      const matchesQuery = matchesSearch(query, item.id, item.userId, item.userName, item.docType, item.docNumber)
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [kycCases, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">KYC verification</div>
        <div className="text-sm text-muted">Review identity documents. Search by KYC ID or user ID.</div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText="Search by KYC ID, user ID, name, or document..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            suggestions={false}
          />
        </div>
        <select
          className={selectClass}
          value={status}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value === "All") next.delete("status")
            else next.set("status", e.target.value)
            setParams(next)
            setPage(1)
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="flex flex-col gap-3">
        {slice.map((item) => (
          <RaCard key={item.id} round="round" styleClass="p-4! flex items-center gap-4">
            <img src={profile01} alt="" className="size-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{item.userName}</div>
              <div className="text-sm text-muted truncate">{item.id} · {item.docType} · {item.submitted}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(item.status)}`}>{item.status}</span>
            <Link to={`/admin/kyc/${item.id}`}>
              <RaButton type="button" btnText="Review" size="sm" variant="outline" widthFill={false} />
            </Link>
          </RaCard>
        ))}
        {filtered.length === 0 && <div className="text-sm text-muted">No KYC cases match.</div>}
      </div>
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminKyc
