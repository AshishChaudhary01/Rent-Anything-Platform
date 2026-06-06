import { Link } from "react-router-dom";
import { ladder01, profile01 } from "../../utils/images";
import { IoCashOutline, IoLocationOutline, IoStar, IoStarHalf } from "react-icons/io5";
// import RaBadge from "../badge/RaBadge";
// import { IoShieldCheckmarkOutline } from "react-icons/io5";

export interface ICardProps {
  item?: {
    id: number,
    title: string,
    rate: number,
    unit: string,
    location: string,
    image: string,
    // description: string,
    // lister: string,
    // rating: number,
    // listerProfile: string 
  };
  styleClass?: string;
}


const RaItemPreviewCard = ({
  item = {
    id: 0,
    image: ladder01,
    title: "Demo Title",
    rate: 0,
    unit: "N/A",
    location: "",
  },
  styleClass,
}: ICardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl w-40 md:w-55 p-0 hover:drop-shadow-lg ${styleClass}`}
    >
      <Link to={""}>
        <div style={{ backgroundImage: `url(${item.image})` }}
          className="size-40 md:size-55 bg-cover bg-center bg-no-repeat rounded-t-2xl"></div>
        <div className="flex flex-col p-2 gap-1">
          <div className="text-base md:text-lg font-bold line-clamp-1">{item.title}</div>
          <div className="flex flex-col gap-y-0 md:gap-y-0.5 justify-between gap-x-2 text-sm md:text-base font-semibold">
            <div className="flex gap-2 items-center font-bold text-primary"><IoCashOutline className="size-5" /> Rs.{item.rate}/{item.unit}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RaItemPreviewCard;