import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoCardOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import Divider from "../../../../components/divider/Divider"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { RENT_STEPS } from "../returnSteps"
import { Link } from "react-router-dom"
import { tools01 } from "../../../../utils/images"
import { raToast } from "../../../../lib/raToast"

function Checkout() {
  const navigate = useNavigate()
  const [method, setMethod] = useState(
    initialLinkedWallets.find((w) => w.isDefault)?.id ?? initialLinkedWallets[0]?.id ?? ""
  )

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={1} title="Rent Item" steps={RENT_STEPS} />

          <div>
            <div className="text-xl font-bold">Checkout</div>
            <div className="text-sm md:text-base font-light text-muted">
              Pay a small commitment fee now. The rest is due at pickup.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex gap-x-4">
              <img src={tools01} alt="Listing" className="size-16 rounded-lg object-cover" />
              <div>
                <div className="font-semibold">Sony A7R IV Professional Kit</div>
                <div className="text-sm text-muted">Nrs. 999 / day</div>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Dates</div>
              <div className="font-medium">Oct 24 - Oct 27</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoTimeOutline className="size-4 text-primary" /> Meetup</div>
              <div className="font-medium">10:30 AM</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium">Lazimpat, Kathmandu</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex justify-between text-muted">
              <span>Commitment fee</span>
              <span className="font-bold text-inherit">Nrs. 100</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Pay now</span>
              <span className="text-primary">Nrs. 100</span>
            </div>
          </RaCard>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <IoCardOutline className="size-5 text-primary" />
                Payment method
              </div>
              <Link to="/user/payment-methods" className="text-sm text-primary">
                Manage
              </Link>
            </div>
            {initialLinkedWallets.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                onClick={() => setMethod(wallet.id)}
                className={`flex items-center gap-3 rounded-2xl p-4 bg-white border cursor-pointer ${method === wallet.id ? "border-primary" : "border-gray-200"}`}
              >
                <img src={wallet.logo} alt="" className="size-10 rounded-full object-cover" />
                <div className="text-left min-w-0">
                  <div className="font-semibold">{wallet.label}</div>
                  <div className="text-sm text-muted">{wallet.accountHint}</div>
                </div>
              </button>
            ))}
          </div>

          <OwnerReturnNav
            onPrev={() => navigate("/user/rent/request-to-rent")}
            onNext={() => {
              raToast.success("Payment successful")
              navigate("/user/rent/confirmation", { state: { paid: true } })
            }}
            nextDisabled={!method}
            nextText="Pay"
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Checkout
