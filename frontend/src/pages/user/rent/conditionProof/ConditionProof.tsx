import { useState } from "react"
import { useNavigate } from "react-router-dom"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaMediaUpload, { type MediaFile } from "../../../../components/upload/RaMediaUpload"
import ReturnFlowHeader from "../ReturnFlowHeader"
import { raToast } from "../../../../lib/raToast"

function ConditionProof() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const navigate = useNavigate()

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={1} />

          <div>
            <div className="text-xl font-bold">Condition Proof</div>
            <div className="text-sm md:text-base font-light text-muted">
              Upload photos and videos of the item as it is now. This protects your deposit and helps finish the return.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-4">
            <RaMediaUpload onChange={setFiles} />
            <div>
              <div className="font-semibold mb-2">Best Results</div>
              <ul className="list-disc pl-5 text-sm font-light text-muted space-y-1">
                <li>Use clear, natural lighting.</li>
                <li>Capture all angles clearly.</li>
              </ul>
            </div>
          </RaCard>

          <RaButton
            type="button"
            btnText="Submit Proof"
            disabled={files.length === 0}
            clickFunc={() => {
              raToast.success("Condition proof submitted")
              navigate("/user/rent/return-meetup")
            }}
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ConditionProof
