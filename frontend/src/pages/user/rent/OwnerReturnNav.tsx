import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5"
import RaButton from "../../../components/button/RaButton"

function OwnerReturnNav({
  onPrev,
  onNext,
  nextDisabled,
  nextText = "Continue",
}: {
  onPrev: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextText?: string
}) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <RaButton
          type="button"
          variant="outline"
          btnText="Previous"
          icon={<IoArrowBackOutline />}
          iconPosition="left"
          clickFunc={onPrev}
        />
      </div>
      <div className="flex-1">
        <RaButton
          type="button"
          btnText={nextText}
          icon={<IoArrowForwardOutline />}
          disabled={nextDisabled}
          clickFunc={onNext}
        />
      </div>
    </div>
  )
}

export default OwnerReturnNav
