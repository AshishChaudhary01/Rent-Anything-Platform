import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import { esewa, khalti } from "../../../../utils/images"

function PaymentMethods() {
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Payment methods" }]} />
          <div className="text-xl md:text-2xl font-bold">Payment methods</div>

          <RaCard round="round" styleClass="flex items-center gap-3">
            <img src={esewa} alt="" className="size-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">eSewa</div>
              <div className="text-sm text-muted">You pay on eSewa during checkout. Nothing is saved here.</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex items-center gap-3 opacity-70">
            <img src={khalti} alt="" className="size-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">Khalti</div>
              <div className="text-sm text-muted">Coming later.</div>
            </div>
          </RaCard>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default PaymentMethods
