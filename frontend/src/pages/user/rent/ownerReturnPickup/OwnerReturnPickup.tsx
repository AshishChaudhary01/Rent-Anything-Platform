import { Navigate, useSearchParams } from "react-router-dom"

function OwnerReturnPickup() {
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  return <Navigate to={rentalId ? `/user/rent/return-meetup?rentalId=${rentalId}` : "/user/my-listings"} replace />
}

export default OwnerReturnPickup
