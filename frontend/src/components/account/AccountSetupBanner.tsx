import { Link } from "react-router-dom"
import { useAccountStore } from "../../store/accountStore"
import { openHelp } from "../../store/helpStore"

function AccountSetupBanner() {
  const { hasAvatar, profileComplete, kycStatus, canTransact } = useAccountStore()

  if (canTransact) return null

  const steps: { done: boolean; label: string; to: string }[] = [
    { done: hasAvatar, label: "Upload a profile photo", to: "/user/profile" },
    { done: profileComplete, label: "Fill in your profile details", to: "/user/profile" },
    {
      done: kycStatus === "VERIFIED",
      label:
        kycStatus === "REJECTED"
          ? "Resubmit KYC"
          : kycStatus === "PENDING"
            ? "Wait for KYC verification"
            : "Get KYC verified",
      to: "/user/kyc",
    },
  ]

  return (
    <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm">
      <div className="font-semibold">Finish your account to list or rent</div>
      <div className="text-muted mt-1">
        RAP needs a photo you upload, a complete profile, and verified KYC before any rental transaction.
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {steps.map((step) => (
          <li key={step.label}>
            <Link to={step.to} className={step.done ? "text-muted line-through" : "text-primary font-medium"}>
              {step.done ? "Done: " : "Next: "}
              {step.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="text-primary font-medium mt-2 cursor-pointer"
        onClick={() => openHelp("account-setup")}
      >
        How setup works
      </button>
    </div>
  )
}

export default AccountSetupBanner
