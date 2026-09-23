import { useRef, useState } from "react"
import { IoCalendarOutline, IoCameraOutline, IoIdCardOutline, IoPersonOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import { apiFieldErrors } from "../../../../lib/formErrors"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import AccountSetupBanner from "../../../../components/account/AccountSetupBanner"
import { useAccountStore } from "../../../../store/accountStore"
import { useSubmitKyc } from "../../../../hooks/queries/useAccount"

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
  const { fullName: profileName, kycStatus } = useAccountStore()
  const { mutate: saveKyc, isPending } = useSubmitKyc()
  const [fullName, setFullName] = useState(profileName)
  const [docType, setDocType] = useState("citizenship")
  const [docNumber, setDocNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const maxDob = new Date()
  maxDob.setFullYear(maxDob.getFullYear() - 18)
  const maxDobValue = maxDob.toISOString().slice(0, 10)

  const statusCopy = {
    NOT_STARTED: "Not submitted",
    PENDING: "Under review",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  }

  const submit = () => {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = "Name as on ID is required"
    if (!dateOfBirth) next.dateOfBirth = "Date of birth is required"
    else if (dateOfBirth > maxDobValue) next.dateOfBirth = "You must be at least 18 years old"
    if (!docNumber.trim()) next.documentNumber = "Document number is required"
    if (!frontFile || !backFile) next.photos = "Add photos of both sides of your ID"
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    saveKyc(
      {
        fullName,
        dateOfBirth,
        documentType: docType,
        documentNumber: docNumber,
        front: frontFile!,
        back: backFile!,
      },
      {
        onSuccess: () => {
          setErrors({})
          raToast.success("KYC submitted for review")
        },
        onError: (error) => {
          setErrors(apiFieldErrors(error))
          raToast.fromError(error)
        },
      },
    )
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
              {statusCopy[kycStatus]}
            </span>
          </div>

          <AccountSetupBanner />

          {kycStatus === "PENDING" && (
            <RaCard round="round" styleClass="text-sm text-muted">
              Your documents are with the RAP team. Listing and rentals stay locked until your KYC is verified.
            </RaCard>
          )}

          {kycStatus === "VERIFIED" && (
            <RaCard round="round" styleClass="text-sm text-muted">
              Your identity is verified. You do not need to upload again unless your details change.
            </RaCard>
          )}

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <RaInput
              name="fullName"
              label="Name as on ID"
              placeholderText="Ram Rai"
              Icon={IoPersonOutline}
              value={fullName}
              error={errors.fullName || errors.kycName}
              onChange={(e) => {
                setFullName(e.target.value)
                setErrors((prev) => ({ ...prev, fullName: "" }))
              }}
            />
            <RaInput
              type="date"
              name="dateOfBirth"
              label="Date of birth"
              Icon={IoCalendarOutline}
              value={dateOfBirth}
              max={maxDobValue}
              error={errors.dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value)
                setErrors((prev) => ({ ...prev, dateOfBirth: "" }))
              }}
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
              name="documentNumber"
              label="Document number"
              placeholderText="12-01-78-01234"
              Icon={IoIdCardOutline}
              value={docNumber}
              error={errors.documentNumber || errors.docNumber}
              onChange={(e) => {
                setDocNumber(e.target.value)
                setErrors((prev) => ({ ...prev, documentNumber: "", docNumber: "" }))
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <PhotoSlot
                label="Front of ID"
                url={frontUrl}
                onPick={(file) => {
                  setFrontFile(file)
                  setFrontUrl(URL.createObjectURL(file))
                  setErrors((prev) => ({ ...prev, photos: "", front: "" }))
                }}
              />
              <PhotoSlot
                label="Back of ID"
                url={backUrl}
                onPick={(file) => {
                  setBackFile(file)
                  setBackUrl(URL.createObjectURL(file))
                  setErrors((prev) => ({ ...prev, photos: "", back: "" }))
                }}
              />
            </div>
            {(errors.photos || errors.front || errors.back) && (
              <span className="text-danger text-xs">{errors.photos || errors.front || errors.back}</span>
            )}
          </RaCard>

          <RaButton
            type="button"
            btnText={isPending ? "Submitting…" : kycStatus === "PENDING" ? "Update submission" : "Submit for review"}
            disabled={isPending || kycStatus === "VERIFIED"}
            clickFunc={submit}
          />
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Kyc
