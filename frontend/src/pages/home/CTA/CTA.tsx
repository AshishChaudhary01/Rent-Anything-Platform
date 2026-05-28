import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import CTACard from "./CTACard";

const CTA = () => {
  return (
    <section className="py-16">
      <RaContainer>
        <RaContainerPadding>
          <CTACard />
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default CTA;