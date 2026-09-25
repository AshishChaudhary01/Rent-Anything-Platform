import RaButton from "../../../../components/button/RaButton"
import AuthLink from "../../../../components/auth/AuthLink"
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
    <AuthLink
      to={`/user/rent/request-to-rent?listing=${listing.id}`}
      message="Sign in to request this rental."
      className="block"
    >
      <RaButton
        type="button"
        btnText={listing.status === "RENTED" ? "Request other dates" : "Request to Rent"}
        size="large"
        variant={listing.status === "RENTED" ? "secondary" : "primary"}
      />
    </AuthLink>
  )
}

export default RequestToRentButton
