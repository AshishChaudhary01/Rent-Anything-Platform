import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import { useAdminStore } from "../../../store/adminStore"
import { useAuthStore } from "../../../store/authStore"
import { raToast } from "../../../lib/raToast"
import { selectClass, statusClass } from "../../../components/admin/adminUi"

function AdminReportDetails() {
  const { id } = useParams()
  const reports = useAdminStore((s) => s.reports)
  const users = useAdminStore((s) => s.users)
  const resolveReport = useAdminStore((s) => s.resolveReport)
  const setUserStatus = useAdminStore((s) => s.setUserStatus)
  const setListingStatus = useAdminStore((s) => s.setListingStatus)
  const authUserId = useAuthStore((s) => s.userId)
  const report = reports.find((item) => item.id === id)
  const me = users.find((u) => u.id === authUserId)
  const [action, setAction] = useState("Warning issued")
  const [notes, setNotes] = useState("")
  const [notesError, setNotesError] = useState("")

  if (!report) {
    return <div className="text-muted">Report not found. <Link to="/admin/reports" className="text-primary">Back</Link></div>
  }

  const closeCase = () => {
    if (!notes.trim()) {
      setNotesError("Add resolution notes before closing")
      return
    }
    setNotesError("")
    resolveReport(report.id, {
      resolverId: me?.id || authUserId || "admin",
      resolverName: me?.fullName || "Admin",
      action,
      notes: notes.trim(),
      closedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    })
    raToast.success("Case closed")
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/admin/reports" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Reports
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{report.reason}</div>
          <div className="text-sm text-muted">{report.id} · opened {report.opened}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(report.status)}`}>{report.status}</span>
      </div>

      <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2"><span className="text-muted">Listing</span><Link className="text-primary" to={`/admin/listings/${report.listingId}`}>{report.listingTitle} (#{report.listingId})</Link></div>
        <div className="flex justify-between gap-2"><span className="text-muted">Reporter</span><Link className="text-primary" to={`/admin/users/${report.reporterId}`}>{report.reporterName}</Link></div>
        <div className="flex justify-between gap-2"><span className="text-muted">Accused</span><Link className="text-primary" to={`/admin/users/${report.accusedId}`}>{report.accusedName}</Link></div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">Booking</span>
          {report.rentalId ? <Link className="text-primary" to={`/admin/rentals/${report.rentalId}`}>{report.rentalId}</Link> : <span>None</span>}
        </div>
        <p className="text-muted pt-2">{report.detail}</p>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-3">
        <div className="font-semibold">Proof</div>
        <div className="grid grid-cols-2 gap-3">
          {report.proofs.map((proof) => (
            <div key={proof.label} className="rounded-xl overflow-hidden bg-surface">
              {proof.type === "video" ? (
                <video src={proof.url} poster={proof.url} controls className="w-full aspect-video object-cover bg-black" />
              ) : (
                <img src={proof.url} alt={proof.label} className="w-full aspect-video object-cover" />
              )}
              <div className="text-xs px-2 py-1.5 flex justify-between">
                <span>{proof.label}</span>
                <span className="text-muted">{proof.type}</span>
              </div>
            </div>
          ))}
        </div>
      </RaCard>

      {report.resolution && (
        <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
          <div className="font-semibold">Resolution</div>
          <div className="flex justify-between gap-2"><span className="text-muted">Resolver</span><span>{report.resolution.resolverName}</span></div>
          <div className="flex justify-between gap-2"><span className="text-muted">Action</span><span>{report.resolution.action}</span></div>
          <div className="flex justify-between gap-2"><span className="text-muted">Closed</span><span>{report.resolution.closedAt}</span></div>
          <p className="text-muted pt-1">{report.resolution.notes}</p>
        </RaCard>
      )}

      {report.status === "Pending" && (
        <RaCard round="round" styleClass="flex flex-col gap-4">
          <div className="font-semibold">Close ticket</div>
          <div className="text-sm text-muted">Resolver: {me?.fullName || "Admin"}</div>
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
            <RaButton type="button" btnText="Close case" clickFunc={closeCase} />
            <RaButton
              type="button"
              btnText="Suspend accused"
              variant="outline"
              clickFunc={() => { setUserStatus(report.accusedId, "Suspended"); raToast.warning(`${report.accusedName} suspended`) }}
            />
            <RaButton
              type="button"
              btnText="Remove listing"
              variant="danger"
              clickFunc={() => { setListingStatus(report.listingId, "Removed"); raToast.success("Listing removed") }}
            />
          </div>
        </RaCard>
      )}
    </div>
  )
}

export default AdminReportDetails
