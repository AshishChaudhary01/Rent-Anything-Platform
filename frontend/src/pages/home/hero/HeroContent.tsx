import { Link } from "react-router-dom";
import RaButton from "../../../components/button/RaButton";
import { IoArrowForward } from "react-icons/io5";
import RaBadge from "../../../components/badge/RaBadge";

const HeroContent = () => {
  return (
    <div className="grid gap-6">
      <div className="flex">
        <RaBadge badgeText="NEPAL'S RENTING PLATFORM" variant="primary" size="sm" widthFill={false} />
      </div>
      <h1 className="text-dark text-4xl md:text-5xl lg:text-7xl font-extrabold">
        Rent what you <span className="text-primary">need</span>, Lend what you <span className="text-primary">have</span>.
      </h1>
      <p className="md:text-xl lg:text-3xl text-muted font-light">
        Join Nepal's premier peer-to-peer rental marketplace. Save money, reduce waste and earn locally.
      </p>
      <div className="flex items-center gap-4">
        <RaButton btnText="Browse Items" widthFill={false} />
        <Link to={"/how-it-works"}>
          <RaButton
            btnText="How It Works"
            size="large"
            variant="lean"
            icon={<IoArrowForward />}
            iconPosition="right"
            widthFill={false} />
        </Link>
      </div>
    </div>
  );
}

export default HeroContent;