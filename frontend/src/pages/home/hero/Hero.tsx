import RaContainer from "../../../components/container/RaContainer";
import HeroBanner from "./HeroBanner";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <div className="pt-20 px-6 md:px-7 lg:px-8 xxl:px-0">
      <RaContainer>
        <div className="grid justify-center gap-12 py-8 md:py-14 md:grid-cols-2 lg:gap-16 lg:py-18">
          <HeroContent />
          <HeroBanner />
        </div>
      </RaContainer>
    </div>
  )
}

export default Hero;