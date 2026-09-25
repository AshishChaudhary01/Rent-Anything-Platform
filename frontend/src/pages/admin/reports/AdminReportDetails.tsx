import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline, IoCheckmarkDoneOutline, IoImagesOutline, IoPauseOutline, IoTrashOutline } from "react-icons/io5"
import { AdminSectionTitle } from "../../../components/admin/AdminPageHeader"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import { runConfirmedAction } from "../../../lib/criticalAction"
import { selectClass, statusClass, formatNptDateTime, staffRoleLabel } from "../../../components/admin/adminUi"
import TicketResolution, { resolverDisplayName } from "../../../components/report/TicketResolution"
import ProofGallery from "../../../components/report/ProofGallery"
import { useAccountStore } from "../../../store/accountStore"
import { useAuthStore } from "../../../store/authStore"
import { useAdminReport, useResolveAdminReport, useSetAdminListingStatus, useSetAdminUserStatus } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminReportDetails() {
  const { id } = useParams()
  const { data: report, isPending } = useAdminReport(id)
  const resolveReport = useResolveAdminReport()
  const setUserStatus = useSetAdminUserStatus()
  const setListingStatus = useSetAdminListingStatus()
  const closerName = useAccountStore((s) => s.fullName)
  const closerEmail = useAccountStore((s) => s.email)
  const closerRole = useAuthStore((s) => s.role)
  const [action, setAction] = useState("Warning issued")
  const [notes, setNotes] = useState("")
  const [notesError, setNotesError] = useState("")

  if (isPending) {
    return <RaPageLoader label="Loading report…" />
  }

  if (!report) {
    return <div className="text-muted">Report not found. <Link to="/admin/reports" className="text-primary">Back</Link></div>
  }

  const closeCase = async () => {
    if (!notes.trim()) {
      setNotesError("Add resolution notes before closing")
      return
    }
    setNotesError("")
    await runConfirmedAction({
      confirm: {
        title: "Close this ticket?",
        body: "The reporter and accused will be notified. This cannot be undone from the app.",
        confirmText: "Close case",
        danger: true,
      },
      run: () => resolveReport.mutateAsync({ id: report.id, action, notes: notes.trim() }),
      success: "Case closed",
    })
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/admin/reports" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Reports
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{report.reason}</div>
          <div className="text-sm text-muted">{report.id} · opened {formatNptDateTime(report.createdAt) || report.opened}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status)}`}>{report.status}</span>
      </div>

      <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted">Listing</span>
          {report.listingId ? (
            <Link className="text-primary" to={`/admin/listings/${report.listingId}`}>{report.listingTitle}</Link>
          ) : (
            <span>{report.listingTitle || "—"}</span>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">Reporter</span>
          {report.reporterId ? (
            <Link className="text-primary" to={`/admin/users/${report.reporterId}`}>{report.reporterName}</Link>
          ) : (
            <span>{report.reporterName}</span>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">Accused</span>
          {report.accusedId ? (
            <Link className="text-primary" to={`/admin/users/${report.accusedId}`}>{report.accusedName}</Link>
          ) : (
            <span>{report.accusedName || "—"}</span>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">Booking</span>
          {report.rentalId ? <Link className="text-primary" to={`/admin/rentals/${report.rentalId}`}>{report.rentalId.slice(0, 8)}</Link> : <span>None</span>}
        </div>
        <p className="text-muted pt-2">{report.detail}</p>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-3">
        <AdminSectionTitle icon={IoImagesOutline}>Proof</AdminSectionTitle>
        <ProofGallery urls={report.proofs} />
      </RaCard>

      {report.status === "Resolved" && (
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
            showStaffContact
          />
        </RaCard>
      )}

      {report.status === "Pending" && (
        <RaCard round="round" styleClass="flex flex-col gap-4">
          <AdminSectionTitle icon={IoCheckmarkDoneOutline}>Close ticket</AdminSectionTitle>
          <div className="text-sm text-muted">
            Closing as {resolverDisplayName(closerName, closerEmail)} ({staffRoleLabel(closerRole) || "Admin"}). The reporter and accused get in-app and email notices with this decision.
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Resolution action
            <select className={selectClass} value={action} onChange={(e) => setAction(e.target.value)}>
              <option>Warning issued</option>
              <option>Partial deposit withheld</option>
              <option>Full refund</option>
              <option>No action — dismissed</option>
              <option>User suspended</option>
              <option>Listing removed</option>
            </select>
          </label>
          <RaInput name="notes" label="Resolution notes" value={notes} error={notesError} onChange={(e) => { setNotes(e.target.value); setNotesError("") }} placeholderText="What was decided and why" />
          <div className="flex flex-col sm:flex-row gap-2">
            <RaButton type="button" btnText="Close case" icon={<IoCheckmarkDoneOutline />} iconPosition="left" clickFunc={() => void closeCase()} />
            {report.accusedId && (
              <RaButton
                type="button"
                btnText="Suspend accused"
                variant="outline"
                icon={<IoPauseOutline />}
                iconPosition="left"
                clickFunc={() =>
                  void runConfirmedAction({
                    confirm: {
                      title: `Suspend ${report.accusedName}?`,
                      body: "They will not be able to rent or list until restored.",
                      confirmText: "Suspend",
                      danger: true,
                    },
                    run: () => setUserStatus.mutateAsync({ id: report.accusedId!, status: "Suspended" }),
                    success: `${report.accusedName} suspended`,
                    undo: () => setUserStatus.mutateAsync({ id: report.accusedId!, status: "Active" }),
                  })
                }
              />
            )}
            {report.listingId && (
              <RaButton
                type="button"
                btnText="Remove listing"
                variant="danger"
                icon={<IoTrashOutline />}
                iconPosition="left"
                clickFunc={() =>
                  void runConfirmedAction({
                    confirm: {
                      title: "Remove this listing?",
                      body: `${report.listingTitle || "This listing"} will be taken down. You can undo this from the toast if it was a mistake.`,
                      confirmText: "Remove",
                      danger: true,
                    },
                    run: () => setListingStatus.mutateAsync({ id: report.listingId!, status: "Removed" }),
                    success: "Listing removed",
                    undo: () => setListingStatus.mutateAsync({ id: report.listingId!, status: "Active" }),
                  })
                }
              />
            )}
          </div>
        </RaCard>
      )}
    </div>
  )
}

export default AdminReportDetails
