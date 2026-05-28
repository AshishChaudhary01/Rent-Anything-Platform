import { Link } from "react-router-dom"
import RaButton from "../../../components/button/RaButton"

function CTACard() {
  return (
    <div className="bg-primary text-white rounded-4xl py-25 px-4">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="font-bold text-3xl md:text-6xl max-w-150 text-center">
            Ready To turn your stuff into extra cash?
          </div>
          <div className="font-extralight text-lg md:text-2xl max-w-170 text-center">
            Join thousands of Nepalese families earning an average of Rs.
            15,000/month by renting out their belongings.
          </div>
        </div>
        <div className="flex justify-center align-middle">
          <Link to={""}>
            <RaButton size="large" btnText="List an Item" variant="inverted" widthFill={false} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CTACard;