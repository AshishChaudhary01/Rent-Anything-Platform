import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoArrowBackOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import { raToast } from "../../../lib/raToast"
import { apiErrorMessage } from "../../../lib/formErrors"
import { statusClass } from "../../../components/admin/adminUi"
import { useAdminKycCase, useReviewAdminKyc } from "../../../hooks/queries/useAdmin"

function AdminKycDetails() {
  const { id } = useParams()
  const { data: item, isPending } = useAdminKycCase(id)
  const reviewKyc = useReviewAdminKyc()
  const [notes, setNotes] = useState("")
  const [notesError, setNotesError] = useState("")

  if (isPending) {
    return <div className="text-muted">Loading KYC case…</div>
  }

  if (!item) {
    return <div className="text-muted">KYC case not found. <Link to="/admin/kyc" className="text-primary">Back</Link></div>
  }

  const decide = async (approved: boolean) => {
    if (!approved && !notes.trim()) {
      setNotesError("Add a reason when rejecting")
      return
    }
    setNotesError("")
    try {
      await reviewKyc.mutateAsync({
        id: item.id,
        approved,
        notes: notes.trim() || "Document matches profile.",
      })
      raToast.success(approved ? "KYC verified" : "KYC rejected")
    } catch (error) {
      raToast.error(apiErrorMessage(error))
    }
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/admin/kyc" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> KYC
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{item.fullName}</div>
          <div className="text-sm text-muted">{item.id} · joined {item.joined}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(item.kycStatus)}`}>{item.kycStatus}</span>
      </div>

      <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
        <div className="flex justify-between"><span className="text-muted">User</span><Link className="text-primary" to={`/admin/users/${item.id}`}>{item.fullName}</Link></div>
        <div className="flex justify-between"><span className="text-muted">Legal name</span><span>{item.kycFullName || "—"}</span></div>
        <div className="flex justify-between"><span className="text-muted">Date of birth</span><span>{item.kycDateOfBirth || "—"}</span></div>
        <div className="flex justify-between"><span className="text-muted">Document</span><span>{item.kycDocumentType || "—"}</span></div>
        <div className="flex justify-between"><span className="text-muted">Document no.</span><span>{item.kycDocumentNumber || "—"}</span></div>
      </RaCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-sm font-medium mb-2">Front</div>
          {item.kycFrontUrl ? (
            <img src={item.kycFrontUrl} alt="Front of ID" className="w-full rounded-2xl object-cover aspect-4/3 bg-surface" />
          ) : (
            <div className="w-full rounded-2xl aspect-4/3 bg-surface text-sm text-muted flex items-center justify-center">No front image</div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Back</div>
          {item.kycBackUrl ? (
            <img src={item.kycBackUrl} alt="Back of ID" className="w-full rounded-2xl object-cover aspect-4/3 bg-surface" />
          ) : (
            <div className="w-full rounded-2xl aspect-4/3 bg-surface text-sm text-muted flex items-center justify-center">No back image</div>
          )}
        </div>
      </div>

      {item.kycNotes && (
        <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
          <div className="font-semibold">Review notes</div>
          <p className="text-muted">{item.kycNotes}</p>
        </RaCard>
      )}

      {item.kycStatus === "Pending" && (
        <RaCard round="round" styleClass="flex flex-col gap-4">
          <RaInput name="kycNotes" label="Reviewer notes" value={notes} error={notesError} onChange={(e) => { setNotes(e.target.value); setNotesError("") }} placeholderText="Match notes or rejection reason" />
          <div className="flex gap-2">
            <RaButton type="button" btnText="Verify" icon={<IoCheckmarkCircleOutline />} iconPosition="left" clickFunc={() => void decide(true)} />
            <RaButton type="button" btnText="Reject" variant="danger" icon={<IoCloseCircleOutline />} iconPosition="left" clickFunc={() => void decide(false)} />
          </div>
        </RaCard>
      )}
    </div>
  )
}

export default AdminKycDetails
