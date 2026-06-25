import { IoArrowForwardOutline } from "react-icons/io5"
import RaButton from "../../../../components/button/RaButton"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import { Link } from "react-router-dom"

function CheckoutSummaryCard() {
  return (

    <RaCard styleClass="flex flex-col gap-y-4">
      {/* Confirm Button for Small Screen ONLY */}
      <div className="lg:hidden text-base md:text-lg gap-x-2 flex justify-between">
        <div className="flex items-center flex-2 gap-x-2">
          <p>Total:</p>
          <p className="font-bold text-primary">Nrs. 400</p>
        </div>
        <Link to={"/user/rent/confirmation"} className="flex-2">
          <RaButton type="submit" btnText="Pay" size="large" />
        </Link>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>Commitment fee</p>
          </div>
          <p className="font-bold">Nrs. 100</p>
        </div>
        <div className="hidden lg:flex lg:justify-between my-2">
          <div className="flex gap-x-2 items-center text-xl font-semibold">
            <p>Sub Total:</p>
          </div>
          <p className="font-bold">Nrs. 100</p>
        </div>
      </div>
      <Divider />

      {/* Confirm Button Full view Only */}
      <div className="hidden lg:block">
        <Link to={"/user/rent/confirmation"}>
          <RaButton type="submit" btnText="Confirm" icon={<IoArrowForwardOutline />} />
        </Link>
      </div>
      <div className="text-center text-muted font-light text-sm"> For now, you will only be charged a small commitment fee that will later be deducted from your total fee.</div>
    </RaCard>
  )
}

export default CheckoutSummaryCard