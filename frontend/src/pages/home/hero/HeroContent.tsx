import { Link } from "react-router-dom";
import RaButton from "../../../components/button/RaButton";
import { IoArrowForward } from "react-icons/io5";

const HeroContent = () => {
  return (
    <div className="grid gap-6">
      <div className="gap-0 bg-accent py-1 px-2 w-fit h-fit rounded-full">
        <p className="font-thin text-text text-xs">NEPAL'S RENTING PLATFORM</p>
      </div>
      <h1 className="text-dark text-4xl md:text-5xl lg:text-7xl font-extrabold">
        Rent what you <span className="text-primary">need</span>, Lend what you <span className="text-primary">have</span>.
      </h1>
      <p className="text-lg text-muted font-light">
        Join Nepal's premier peer-to-peer rental marketplace. Save money, reduce waste and earn locally.
      </p>
      <div className="flex items-center gap-4">
        <RaButton btnText="Browse Items" size="large" widthFill={false} />
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