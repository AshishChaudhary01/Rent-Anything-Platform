import { useNavigate, useSearchParams } from "react-router-dom"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaMediaUpload, { type MediaFile } from "../../../../components/upload/RaMediaUpload"
import ReturnFlowHeader from "../ReturnFlowHeader"
import { raToast } from "../../../../lib/raToast"
import { useRental } from "../../../../hooks/queries/useRentals"
import { useState } from "react"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function ConditionProof() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)

  if (!rentalId) return <p className="px-6 py-10 text-muted">Choose a rental first.</p>
  if (isPending || !rental) return <RaPageLoader label="Loading rental…" />

  const goMeetup = () => navigate(`/user/rent/return-meetup?rentalId=${rental.id}`)

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={1} />

          <div>
            <div className="text-xl font-bold">Condition Proof</div>
            <div className="text-sm md:text-base font-light text-muted">
              Optional. Photos help protect your deposit. You can skip and continue to the return meetup.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <RaMediaUpload onChange={setFiles} />
            <ul className="list-disc pl-5 text-sm font-light text-muted space-y-1">
              <li>Use clear, natural lighting.</li>
              <li>Capture all angles clearly.</li>
            </ul>
          </RaCard>

          <RaButton
            type="button"
            btnText="Continue to meetup"
            clickFunc={() => {
              if (files.length > 0) raToast.success("Condition photos saved on this device for the meetup")
              goMeetup()
            }}
          />
          <RaButton type="button" btnText="Skip for now" variant="ghost" clickFunc={goMeetup} />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ConditionProof
