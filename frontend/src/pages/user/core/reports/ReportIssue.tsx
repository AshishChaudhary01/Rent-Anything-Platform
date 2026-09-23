import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaMediaUpload, { type MediaFile } from "../../../../components/upload/RaMediaUpload"
import { REPORT_CONTEXTS, REPORT_REASONS, type ReportContext } from "../../../../data/reports"
import { useAdminStore } from "../../../../store/adminStore"
import { useAccountStore } from "../../../../store/accountStore"
import { useAuthStore } from "../../../../store/authStore"
import { raToast } from "../../../../lib/raToast"
import { selectClass } from "../../../../components/admin/adminUi"

function asContext(value: string | null): ReportContext {
  return REPORT_CONTEXTS.includes(value as ReportContext) ? (value as ReportContext) : "listing"
}

function ReportIssue() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const context = asContext(params.get("context"))
  const reasons = REPORT_REASONS[context]
  const listingTitle = params.get("listingTitle") || "Listing"
  const listingIdParam = params.get("listingId")
  const accusedName = params.get("accusedName") || "User"
  const accusedIdParam = params.get("accusedId")
  const rentalId = params.get("rentalId")
  const presetReason = params.get("reason")

  const listings = useAdminStore((s) => s.listings)
  const users = useAdminStore((s) => s.users)
  const submitReport = useAdminStore((s) => s.submitReport)
  const authUserId = useAuthStore((s) => s.userId)
  const reporterName = useAccountStore((s) => s.fullName)

  const listing = listings.find((item) => String(item.id) === listingIdParam)
    || listings.find((item) => item.title.toLowerCase() === listingTitle.toLowerCase())
    || listings.find((item) => item.title.toLowerCase().includes(listingTitle.toLowerCase().slice(0, 12)))
  const accused = users.find((item) => item.id === accusedIdParam)
    || users.find((item) => item.fullName.toLowerCase() === accusedName.toLowerCase())

  const [reason, setReason] = useState(presetReason && reasons.includes(presetReason) ? presetReason : reasons[0])
  const [detail, setDetail] = useState("")
  const [proofs, setProofs] = useState<MediaFile[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const summary = useMemo(() => ({
    listingTitle: listing?.title || listingTitle,
    listingId: listing?.id ?? (Number(listingIdParam) || listings[0]?.id || 1),
    accusedName: accused?.fullName || accusedName,
    accusedId: accused?.id || accusedIdParam || "u-unknown",
  }), [listing, listingTitle, listingIdParam, listings, accused, accusedName, accusedIdParam])

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
              Trust and safety will review this with your proof. Do not include private chat.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-3"><span className="text-muted">Listing</span><span className="text-right font-medium">{summary.listingTitle} (#{summary.listingId})</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Reported user</span><span className="font-medium">{summary.accusedName}</span></div>
            {rentalId && <div className="flex justify-between gap-3"><span className="text-muted">Booking</span><span className="font-medium">{rentalId}</span></div>}
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
              const id = submitReport({
                listingId: summary.listingId,
                listingTitle: summary.listingTitle,
                reporterId: authUserId || "u-ram",
                reporterName: reporterName || "Ram Rai",
                accusedId: summary.accusedId,
                accusedName: summary.accusedName,
                rentalId: rentalId || null,
                reason,
                detail: detail.trim(),
                proofs: proofs.map((item) => ({
                  type: item.file.type.startsWith("video/") ? "video" : "image",
                  url: item.url,
                  label: item.file.name,
                })),
              })
              raToast.success("Report submitted")
              navigate(`/user/reports/${id}`)
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
            <RaButton type="submit" btnText="Submit report" />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReportIssue
