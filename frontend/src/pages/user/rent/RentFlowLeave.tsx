import { useNavigate } from "react-router-dom"
import { IoHomeOutline, IoListOutline } from "react-icons/io5"
import RaButton from "../../../components/button/RaButton"

function RentFlowLeave({
  owner,
  listingId,
  rentalId,
}: {
  owner?: boolean
  listingId?: string
  rentalId?: string
}) {
  const navigate = useNavigate()
  const stayPath = owner
    ? rentalId
      ? `/user/request-details/${rentalId}`
      : "/user/my-listings"
    : "/user/my-rentals"
  const stayLabel = owner ? (rentalId ? "Request progress" : "My listings") : "My rentals"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <RaButton
        type="button"
        btnText={stayLabel}
        variant="success"
        icon={<IoListOutline />}
        iconPosition="left"
        clickFunc={() => navigate(stayPath)}
      />
      <RaButton
        type="button"
        btnText="Home"
        variant="ghost"
        icon={<IoHomeOutline />}
        iconPosition="left"
        clickFunc={() => navigate("/user")}
      />
    </div>
  )
}

export default RentFlowLeave
