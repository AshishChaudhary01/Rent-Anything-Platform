import { useRef, useState } from "react"
import { IoCalendarOutline, IoCameraOutline, IoIdCardOutline, IoPersonOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import { initialProfile } from "../../../../data/account"

type KycStatus = "not_started" | "pending" | "verified"

function PhotoSlot({
  label,
  url,
  onPick,
}: {
  label: string
  url: string | null
  onPick: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center gap-2 aspect-4/3 rounded-2xl border-2 border-dashed border-muted/30 bg-surface overflow-hidden cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ""
        }}
      />
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <>
          <IoCameraOutline className="size-8 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </>
      )}
    </button>
  )
}

function Kyc() {
  const [status, setStatus] = useState<KycStatus>("not_started")
  const [fullName, setFullName] = useState(initialProfile.fullName)
  const [docType, setDocType] = useState("citizenship")
  const [docNumber, setDocNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const maxDob = new Date()
  maxDob.setFullYear(maxDob.getFullYear() - 18)
  const maxDobValue = maxDob.toISOString().slice(0, 10)

  const statusCopy = {
    not_started: "Not submitted",
    pending: "Under review",
    verified: "Verified",
  }

  const submit = () => {
    if (!fullName.trim() || !dateOfBirth || !docNumber.trim() || !frontUrl || !backUrl) {
      raToast.error("Add your name, date of birth, ID number, and both photos")
      return
    }
    if (dateOfBirth > maxDobValue) {
      raToast.error("You must be at least 18 years old")
      return
    }
    setStatus("pending")
    raToast.success("KYC submitted for review")
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "KYC" }]} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold">KYC verification</div>
              <div className="text-sm md:text-base font-light text-muted">
                Verify your identity to list items and start rentals.
              </div>
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
              {statusCopy[status]}
            </span>
          </div>

          {status === "pending" && (
            <RaCard round="round" styleClass="text-sm text-muted">
              Your documents are with the RAP team. You can keep using the app while we review.
            </RaCard>
          )}

          {status === "verified" && (
            <RaCard round="round" styleClass="text-sm text-muted">
              Your identity is verified. You do not need to upload again unless your details change.
            </RaCard>
          )}

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <RaInput
              name="kycName"
              label="Name as on ID"
              placeholderText="Ram Rai"
              Icon={IoPersonOutline}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <RaInput
              type="date"
              name="dateOfBirth"
              label="Date of birth"
              Icon={IoCalendarOutline}
              value={dateOfBirth}
              max={maxDobValue}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <div className="grid gap-3">
              <label htmlFor="docType" className="font-medium text-text-dark">
                Document type
              </label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-surface border border-muted/20 p-3 rounded-full outline-none"
              >
                <option value="citizenship">Citizenship</option>
                <option value="national-id">National ID</option>
                <option value="passport">Passport</option>
              </select>
            </div>
            <RaInput
              name="docNumber"
              label="Document number"
              placeholderText="12-01-78-01234"
              Icon={IoIdCardOutline}
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <PhotoSlot
                label="Front of ID"
                url={frontUrl}
                onPick={(file) => setFrontUrl(URL.createObjectURL(file))}
              />
              <PhotoSlot
                label="Back of ID"
                url={backUrl}
                onPick={(file) => setBackUrl(URL.createObjectURL(file))}
              />
            </div>
          </RaCard>

          <RaButton
            type="button"
            btnText={status === "pending" ? "Update submission" : "Submit for review"}
            disabled={status === "verified"}
            clickFunc={submit}
          />
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Kyc
