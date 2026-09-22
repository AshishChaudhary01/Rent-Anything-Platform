import { Link, useParams } from "react-router-dom"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import { useAdminStore } from "../../../../store/adminStore"
import { useAuthStore } from "../../../../store/authStore"
import { statusClass } from "../../../../components/admin/adminUi"

function MyReportDetails() {
  const { id } = useParams()
  const reports = useAdminStore((s) => s.reports)
  const userId = useAuthStore((s) => s.userId) || "u-ram"
  const report = reports.find((item) => item.id === id && item.reporterId === userId)

  if (!report) {
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
            { label: report.id },
          ]} />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xl md:text-2xl font-bold">{report.reason}</div>
              <div className="text-sm text-muted">{report.id} · {report.opened}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status)}`}>{report.status}</span>
          </div>
          <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2"><span className="text-muted">Listing</span><span>{report.listingTitle}</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted">Reported user</span><span>{report.accusedName}</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted">Booking</span><span>{report.rentalId || "None"}</span></div>
            <p className="text-muted pt-2">{report.detail}</p>
          </RaCard>
          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="font-semibold">Proof</div>
            <div className="grid grid-cols-2 gap-3">
              {report.proofs.map((proof) => (
                <div key={proof.label} className="rounded-xl overflow-hidden bg-surface">
                  {proof.type === "video" ? (
                    <video src={proof.url} controls className="w-full aspect-video object-cover bg-black" />
                  ) : (
                    <img src={proof.url} alt={proof.label} className="w-full aspect-video object-cover" />
                  )}
                  <div className="text-xs px-2 py-1.5">{proof.label}</div>
                </div>
              ))}
            </div>
          </RaCard>
          {report.resolution ? (
            <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
              <div className="font-semibold">Resolution</div>
              <div className="flex justify-between gap-2"><span className="text-muted">Handled by</span><span>{report.resolution.resolverName}</span></div>
              <div className="flex justify-between gap-2"><span className="text-muted">Action</span><span>{report.resolution.action}</span></div>
              <div className="flex justify-between gap-2"><span className="text-muted">Closed</span><span>{report.resolution.closedAt}</span></div>
              <p className="text-muted pt-1">{report.resolution.notes}</p>
            </RaCard>
          ) : (
            <div className="text-sm text-muted">This ticket is still under review.</div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyReportDetails
