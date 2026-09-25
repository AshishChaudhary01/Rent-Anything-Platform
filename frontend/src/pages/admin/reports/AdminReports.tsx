import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { IoAlertCircleOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import RaButton from "../../../components/button/RaButton"
import RaSearchBar from "../../../components/searchbar/RaSearchbar"
import AdminPagination from "../../../components/admin/AdminPagination"
import { matchesSearch, paginate, selectClass, statusClass, formatNptDateTime } from "../../../components/admin/adminUi"
import { useAdminReports } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminReports() {
  const { data: reports = [], isPending } = useAdminReports()
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
        item.resolverName,
      )
      return matchesQuery && (status === "All" || item.status === status)
    })
  }, [reports, query, status])

  const { current, slice } = paginate(filtered, page)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        icon={IoAlertCircleOutline}
        title="Reports / disputes"
        subtitle="New reports email every admin. Closing a case emails the people involved."
      />
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
      {isPending ? (
        <RaPageLoader label="Loading reports…" />
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((report) => (
            <RaCard key={report.id} round="round" styleClass="p-4! flex flex-col md:flex-row md:items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{report.reason}</div>
                <div className="text-sm text-muted truncate">
                  {report.id.slice(0, 8)} · {report.listingTitle} · {report.reporterName} → {report.accusedName}
                  {report.status === "Resolved"
                    ? ` · Closed ${formatNptDateTime(report.resolvedAt)}${report.resolverName ? ` by ${report.resolverName}` : ""}`
                    : ` · ${report.opened}`}
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status)}`}>{report.status}</span>
              <Link to={`/admin/reports/${report.id}`}>
                <RaButton type="button" btnText="Open case" size="sm" widthFill={false} />
              </Link>
            </RaCard>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted">No reports.</div>}
        </div>
      )}
      <AdminPagination page={current} total={filtered.length} onPage={setPage} />
    </div>
  )
}

export default AdminReports
