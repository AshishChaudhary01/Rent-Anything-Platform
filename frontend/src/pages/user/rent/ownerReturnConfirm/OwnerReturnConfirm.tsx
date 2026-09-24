import { Navigate, useSearchParams } from "react-router-dom"

function OwnerReturnConfirm() {
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  return <Navigate to={rentalId ? `/user/rent/rate?rentalId=${rentalId}` : "/user/my-listings"} replace />
}

export default OwnerReturnConfirm
