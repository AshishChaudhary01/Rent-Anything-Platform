import RaStepper from "../../../components/stepper/RaStepper"
import { RETURN_STEPS } from "./returnSteps"

function ReturnFlowHeader({ current }: { current: number }) {
  return (
    <div className="space-y-4">
      <div className="text-xl md:text-3xl font-bold">Return Item</div>
      <RaStepper steps={RETURN_STEPS} current={current} />
    </div>
  )
}

export default ReturnFlowHeader
