import { IoCashOutline, IoChatboxOutline, IoFingerPrintOutline, IoShieldOutline } from "react-icons/io5";
import RaCard from "../../../components/card/RaCard";
import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";

const Foundation = () => {
  return (
    <section className="py-25.5">
      <RaContainer>
        <RaContainerPadding>
          <div>
            <div className="flex flex-col gap-6">
              <div className="self-center text-center text-3xl lg:text-5xl font-extrabold">Trust is our foundation</div>
              <div className="self-center text-center max-w-180 text-xl text-muted">
                Every transaction is protected. Every user is verified. We provide 24/7 support
                and rental insurance for total peace of mind.
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10 py-16">
              <RaCard bg="surface" styleClass="flex flex-col items-center gap-4 max-w-50">
                <IoShieldOutline className="size-8 text-primary" />
                <div className="text-center font-semibold">Insured Items</div>
              </RaCard>
              <RaCard bg="surface" styleClass="flex flex-col items-center gap-4 max-w-50">
                <IoFingerPrintOutline className="size-8 text-primary" />
                <div className="text-center font-semibold">Identity Check</div>
              </RaCard>
              <RaCard bg="surface" styleClass="flex flex-col items-center gap-4 max-w-50">
                <IoChatboxOutline className="size-8 text-primary" />
                <div className="text-center font-semibold">Secure Chat</div>
              </RaCard>
              <RaCard bg="surface" styleClass="flex flex-col items-center gap-4 max-w-50">
                <IoCashOutline className="size-8 text-primary" />
                <div className="text-center font-semibold">Escrow Payments</div>
              </RaCard>
            </div>
          </div>
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default Foundation;