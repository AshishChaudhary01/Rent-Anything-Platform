import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import { useAdminStore } from "../../../store/adminStore"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass } from "../../../components/admin/adminUi"

function AdminReports() {
  const reports = useAdminStore((s) => s.reports)
  const [params, setParams] = useSearchParams()
  const status = params.get("status") || "All"
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return reports.filter((item) => {
      const matchesQuery = matchesSearch(
        query,
        item.id,
        item.reason,
        item.listingTitle,
        item.listingId,
        item.reporterName,
        item.reporterId,
        item.accusedName,
        item.accusedId,
        item.rentalId,
      )
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [reports, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">Reports / disputes</div>
        <div className="text-sm text-muted">Search by case ID, listing, or people involved.</div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <RaSearchBar
            placeholderText="Search by report ID, listing, or user..."
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
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      <div className="flex flex-col gap-3">
        {slice.map((report) => (
          <RaCard key={report.id} round="round" styleClass="p-4! flex flex-col md:flex-row md:items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{report.reason}</div>
              <div className="text-sm text-muted truncate">{report.id} · {report.listingTitle} · {report.reporterName} → {report.accusedName} · {report.opened}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status)}`}>{report.status}</span>
            <Link to={`/admin/reports/${report.id}`}>
              <RaButton type="button" btnText="Open case" size="sm" widthFill={false} />
            </Link>
          </RaCard>
        ))}
        {filtered.length === 0 && <div className="text-sm text-muted">No reports.</div>}
      </div>
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminReports
