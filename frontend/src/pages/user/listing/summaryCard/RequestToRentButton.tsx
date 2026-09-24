import { Link } from "react-router-dom"
import RaButton from "../../../../components/button/RaButton"
import type { Listing } from "../../../../types/listing.types"

const RequestToRentButton = ({ listing }: { listing: Listing }) => {
  if (listing.status === "UNAVAILABLE" || listing.status === "REMOVED") {
    return (
      <RaButton
        type="button"
        btnText="Unavailable"
        size="large"
        disabled
      />
    )
  }
  return (
    <Link to={`/user/rent/request-to-rent?listing=${listing.id}`}>
      <RaButton
        type="button"
        btnText={listing.status === "RENTED" ? "Request other dates" : "Request to Rent"}
        size="large"
        variant={listing.status === "RENTED" ? "secondary" : "primary"}
      />
    </Link>
  )
}

export default RequestToRentButton
