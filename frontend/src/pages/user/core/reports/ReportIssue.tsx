import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaMediaUpload, { type MediaFile } from "../../../../components/upload/RaMediaUpload"
import { REPORT_CONTEXTS, REPORT_REASONS, type ReportContext } from "../../../../data/reports"
import { raToast } from "../../../../lib/raToast"
import { selectClass } from "../../../../components/admin/adminUi"
import { useSubmitReport } from "../../../../hooks/queries/useReports"

function asContext(value: string | null): ReportContext {
  return REPORT_CONTEXTS.includes(value as ReportContext) ? (value as ReportContext) : "listing"
}

function ReportIssue() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const submitReport = useSubmitReport()
  const context = asContext(params.get("context"))
  const reasons = REPORT_REASONS[context]
  const listingTitle = params.get("listingTitle") || "Listing"
  const listingId = params.get("listingId") || undefined
  const accusedName = params.get("accusedName") || "User"
  const accusedId = params.get("accusedId") || undefined
  const rentalId = params.get("rentalId") || undefined
  const presetReason = params.get("reason")

  const [reason, setReason] = useState(presetReason && reasons.includes(presetReason) ? presetReason : reasons[0])
  const [detail, setDetail] = useState("")
  const [proofs, setProofs] = useState<MediaFile[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const summary = useMemo(() => ({
    listingTitle,
    listingId,
    accusedName,
    accusedId,
    rentalId,
  }), [listingTitle, listingId, accusedName, accusedId, rentalId])

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-16">
          <RaBreadcrumb items={[
            { label: "My reports", path: "/user/reports" },
            { label: "New report" },
          ]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Report an issue</div>
            <div className="text-sm md:text-base font-light text-muted">
              Trust and safety will review this with your proof.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-3"><span className="text-muted">Listing</span><span className="text-right font-medium">{summary.listingTitle}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Reported user</span><span className="font-medium">{summary.accusedName}</span></div>
            {summary.rentalId && <div className="flex justify-between gap-3"><span className="text-muted">Booking</span><span className="font-medium">{summary.rentalId}</span></div>}
          </RaCard>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const next: Record<string, string> = {}
              if (!detail.trim()) next.detail = "Describe what happened"
              if (proofs.length === 0) next.proofs = "Add at least one photo or video as proof"
              if (Object.keys(next).length) {
                setErrors(next)
                return
              }
              submitReport.mutate(
                {
                  context,
                  reason,
                  detail: detail.trim(),
                  listingId: summary.listingId,
                  accusedId: summary.accusedId,
                  rentalId: summary.rentalId,
                  files: proofs.map((item) => item.file),
                },
                {
                  onSuccess: (report) => {
                    raToast.success("Report submitted")
                    navigate(`/user/reports/${report.id}`)
                  },
                  onError: (error) => raToast.fromError(error, "Could not submit report"),
                },
              )
            }}
          >
            <label className="flex flex-col gap-1 text-sm font-medium">
              Issue type
              <select className={selectClass} value={reason} onChange={(e) => setReason(e.target.value)}>
                {reasons.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              What happened
              <textarea
                name="detail"
                className={`min-h-28 bg-surface border rounded-2xl p-3 outline-none text-sm placeholder:text-muted/50 ${errors.detail ? "border-danger" : "border-muted/20"}`}
                placeholder="Give dates, what was missing, and what you already tried"
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value)
                  setErrors((prev) => ({ ...prev, detail: "" }))
                }}
              />
              {errors.detail && <span className="text-danger text-xs font-normal">{errors.detail}</span>}
            </label>
            <RaMediaUpload heading="Add photo or video proof" onChange={(files) => { setProofs(files); setErrors((prev) => ({ ...prev, proofs: "" })) }} />
            {errors.proofs && <span className="text-danger text-xs">{errors.proofs}</span>}
            <RaButton type="submit" btnText={submitReport.isPending ? "Submitting…" : "Submit report"} disabled={submitReport.isPending} />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReportIssue
