import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import SustainableCard from "./SustainableCard";

const Sustainable = () => {
  return (
    <section className="py-16">
      <RaContainer>
        <RaContainerPadding>
          <SustainableCard />
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default Sustainable;