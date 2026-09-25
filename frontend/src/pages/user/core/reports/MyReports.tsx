import { Link } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import { formatNptDateTime, statusClass } from "../../../../components/admin/adminUi"
import { useMyReports } from "../../../../hooks/queries/useReports"

function MyReports() {
  const { data: mine = [], isPending } = useMyReports()

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-2xl mx-auto flex flex-col gap-y-6 pb-24">
          <RaBreadcrumb items={[{ label: "My reports" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">My reports</div>
            <div className="text-sm md:text-base font-light text-muted">
              Tickets you opened. RAP reviews proof and posts a resolution when the case is closed.
            </div>
          </div>
          {isPending ? (
            <div className="text-sm text-muted">Loading reports…</div>
          ) : mine.length === 0 ? (
            <div className="text-sm text-muted">You have not submitted any reports yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {mine.map((report) => (
                <RaCard key={report.id} round="round" styleClass="p-4! flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{report.reason}</div>
                    <div className="text-sm text-muted truncate">
                      {report.listingTitle}
                      {report.status === "RESOLVED" && report.resolvedAt
                        ? ` · Closed ${formatNptDateTime(report.resolvedAt)}${report.resolverName ? ` by ${report.resolverName}` : ""}`
                        : ""}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status === "PENDING" ? "Pending" : "Resolved")}`}>{report.status === "PENDING" ? "Pending" : "Resolved"}</span>
                  <Link to={`/user/reports/${report.id}`}>
                    <RaButton type="button" btnText="View" size="sm" variant="outline" widthFill={false} />
                  </Link>
                </RaCard>
              ))}
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyReports
