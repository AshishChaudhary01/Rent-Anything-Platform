import { heroImage } from "../../../utils/images";

const HeroBannerCard = () => {
  return (
    <div className="bg-white rounded-full hidden md:block">
      <img src={heroImage} alt="Nepalese family with backpacks" className="rounded-4xl drop-shadow-2xl" />
    </div>
  );
}

export default HeroBannerCard;