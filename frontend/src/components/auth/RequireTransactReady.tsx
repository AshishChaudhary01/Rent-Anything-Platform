import { Link } from "react-router-dom"
import { useMe } from "../../hooks/queries/useAccount"
import { useAccountStore } from "../../store/accountStore"
import RaCard from "../card/RaCard"
import RaButton from "../button/RaButton"
import RaPageLoader from "../feedback/RaPageLoader"
import { openHelp } from "../../store/helpStore"

function RequireTransactReady({ children }: { children: React.ReactNode }) {
  const { isPending } = useMe()
  const { canTransact, hasAvatar, profileComplete, kycStatus } = useAccountStore()

  if (isPending && !canTransact) {
    return <RaPageLoader label="Checking your account…" />
  }

  if (canTransact) return children

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <RaCard round="round" styleClass="flex flex-col gap-4 p-6!">
        <div className="text-xl font-bold">Complete your account first</div>
        <p className="text-sm text-muted">
        You can browse RAP, but listing an item or starting a rental needs a profile photo, full profile details, and verified KYC.
        </p>
        <ul className="text-sm flex flex-col gap-2">
          <li>{hasAvatar ? "Photo uploaded" : "Upload a profile photo"}</li>
          <li>{profileComplete ? "Profile details saved" : "Fill name, phone, and address"}</li>
          <li>
            {kycStatus === "VERIFIED"
              ? "KYC verified"
              : kycStatus === "PENDING"
                ? "KYC submitted — wait for RAP to verify"
                : "Submit KYC with photos of your ID"}
          </li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link to="/user/profile">
            <RaButton type="button" btnText="Update profile" widthFill={false} />
          </Link>
          <Link to="/user/kyc">
            <RaButton type="button" btnText="Go to KYC" widthFill={false} />
          </Link>
          <RaButton type="button" btnText="How this works" variant="ghost" widthFill={false} clickFunc={() => openHelp("account-setup")} />
        </div>
      </RaCard>
    </div>
  )
}

export default RequireTransactReady
