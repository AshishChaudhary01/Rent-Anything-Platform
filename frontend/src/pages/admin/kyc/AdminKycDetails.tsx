import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import { useAdminStore } from "../../../store/adminStore"
import { useAuthStore } from "../../../store/authStore"
import { raToast } from "../../../lib/raToast"
import { statusClass } from "../../../components/admin/adminUi"

function AdminKycDetails() {
  const { id } = useParams()
  const kycCases = useAdminStore((s) => s.kycCases)
  const users = useAdminStore((s) => s.users)
  const reviewKyc = useAdminStore((s) => s.reviewKyc)
  const authUserId = useAuthStore((s) => s.userId)
  const item = kycCases.find((row) => row.id === id)
  const me = users.find((u) => u.id === authUserId)
  const [notes, setNotes] = useState(item?.notes ?? "")

  if (!item) {
    return <div className="text-muted">KYC case not found. <Link to="/admin/kyc" className="text-primary">Back</Link></div>
  }

  const decide = (status: "Verified" | "Rejected") => {
    if (status === "Rejected" && !notes.trim()) {
      raToast.error("Add a reason when rejecting")
      return
    }
    reviewKyc(item.id, status, me?.fullName || "Admin", notes.trim() || "Document matches profile.")
    raToast.success(status === "Verified" ? "KYC verified" : "KYC rejected")
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/admin/kyc" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> KYC
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{item.userName}</div>
          <div className="text-sm text-muted">{item.id} · submitted {item.submitted}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(item.status)}`}>{item.status}</span>
      </div>

      <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
        <div className="flex justify-between"><span className="text-muted">User</span><Link className="text-primary" to={`/admin/users/${item.userId}`}>{item.userName}</Link></div>
        <div className="flex justify-between"><span className="text-muted">Legal name</span><span>{item.fullName}</span></div>
        <div className="flex justify-between"><span className="text-muted">Date of birth</span><span>{item.dateOfBirth}</span></div>
        <div className="flex justify-between"><span className="text-muted">Document</span><span>{item.docType}</span></div>
        <div className="flex justify-between"><span className="text-muted">Document no.</span><span>{item.docNumber}</span></div>
      </RaCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-sm font-medium mb-2">Front</div>
          <img src={item.frontImage} alt="Front of ID" className="w-full rounded-2xl object-cover aspect-4/3 bg-surface" />
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Back</div>
          <img src={item.backImage} alt="Back of ID" className="w-full rounded-2xl object-cover aspect-4/3 bg-surface" />
        </div>
      </div>

      {(item.reviewer || item.status !== "Pending") && (
        <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
          <div className="font-semibold">Review</div>
          {item.reviewer && <div className="flex justify-between"><span className="text-muted">Reviewer</span><span>{item.reviewer}</span></div>}
          {item.notes && <p className="text-muted">{item.notes}</p>}
        </RaCard>
      )}

      {item.status === "Pending" && (
        <RaCard round="round" styleClass="flex flex-col gap-4">
          <RaInput name="kycNotes" label="Reviewer notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholderText="Match notes or rejection reason" />
          <div className="flex gap-2">
            <RaButton type="button" btnText="Verify" clickFunc={() => decide("Verified")} />
            <RaButton type="button" btnText="Reject" variant="danger" clickFunc={() => decide("Rejected")} />
          </div>
        </RaCard>
      )}
    </div>
  )
}

export default AdminKycDetails
