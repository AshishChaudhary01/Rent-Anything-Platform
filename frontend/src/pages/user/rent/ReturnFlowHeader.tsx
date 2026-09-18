import RaStepper from "../../../components/stepper/RaStepper"
import { RETURN_STEPS } from "./returnSteps"

function ReturnFlowHeader({
  current,
  steps = RETURN_STEPS,
  title = "Return Item",
}: {
  current: number
  steps?: string[]
  title?: string
}) {
  return (
    <div className="space-y-4">
      <div className="text-xl md:text-3xl font-bold">{title}</div>
      <RaStepper steps={steps} current={current} />
    </div>
  )
}

export default ReturnFlowHeader
