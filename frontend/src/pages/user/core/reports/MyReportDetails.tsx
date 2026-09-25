import { Link, useParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import { formatNptDateTime, statusClass } from "../../../../components/admin/adminUi"
import TicketResolution from "../../../../components/report/TicketResolution"
import ProofGallery from "../../../../components/report/ProofGallery"
import { useReport } from "../../../../hooks/queries/useReports"

function MyReportDetails() {
  const { id } = useParams()
  const { data: report, isPending, isError } = useReport(id)

  if (isPending) {
    return <div className="px-6 py-10 text-muted">Loading report…</div>
  }
  if (isError || !report) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <div className="text-muted">Report not found. <Link to="/user/reports" className="text-primary">Back</Link></div>
        </RaContainerPadding>
      </RaContainer>
    )
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-2xl mx-auto flex flex-col gap-y-6 pb-24">
          <RaBreadcrumb items={[
            { label: "My reports", path: "/user/reports" },
            { label: "Report" },
          ]} />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xl md:text-2xl font-bold">{report.reason}</div>
              <div className="text-sm text-muted">{report.listingTitle}</div>
              <div className="text-xs text-muted mt-1">Opened {formatNptDateTime(report.createdAt)}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status === "PENDING" ? "Pending" : "Resolved")}`}>{report.status === "PENDING" ? "Pending" : "Resolved"}</span>
          </div>
          <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2"><span className="text-muted">Listing</span><span>{report.listingTitle}</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted">Reported user</span><span>{report.accusedName}</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted">Booking</span><span>{report.rentalId || "None"}</span></div>
            <p className="text-muted pt-2">{report.detail}</p>
          </RaCard>
          {report.status === "RESOLVED" && (
            <RaCard round="round" styleClass="p-4!">
              <TicketResolution
                ticketId={report.id}
                context={report.context}
                openedAt={report.createdAt}
                resolvedAt={report.resolvedAt}
                resolverName={report.resolverName}
                resolverRole={report.resolverRole}
                resolverEmail={report.resolverEmail}
                action={report.resolutionAction}
                notes={report.resolutionNotes}
              />
            </RaCard>
          )}
          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="font-semibold">Proof</div>
            <ProofGallery urls={report.proofs} />
          </RaCard>
          {report.status === "PENDING" && (
            <div className="text-sm text-muted">This ticket is still under review.</div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyReportDetails
