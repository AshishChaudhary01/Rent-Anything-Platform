import { Link } from "react-router-dom";
import { ladder01, profile01 } from "../../utils/images";
import { IoLocationOutline, IoStar, IoStarHalf } from "react-icons/io5";
// import RaBadge from "../badge/RaBadge";
// import { IoShieldCheckmarkOutline } from "react-icons/io5";

export interface ICardProps {
  item?: { id: number, image: string, title: string, description: string, lister: string, rate: number, unit: string, rating:number, listerProfile: string };
  styleClass?: string;
}


const RaItemPreviewCard = ({
  item = {
    id: 1,
    image: ladder01,
    title: "Demo Title",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 0,
    unit: "N/A",
    rating: 0,
    listerProfile: profile01,
  },
  styleClass,
}: ICardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl w-full p-0 hover:shadow-sm ${styleClass}`}
    >
      <Link to={""}>
        <div style={{ backgroundImage: `url(${item.image})` }}
          className="w-full h-70 md:h-70 bg-cover bg-center bg-no-repeat rounded-2xl"></div>
        <div className="flex flex-col p-4 gap-2">
          <div className="text-lg font-bold line-clamp-1">{item.title}</div>
          {/* <div className="text-sm font-muted font-light line-clamp-2">{item.description}</div> */}
          <div className="flex justify-between text-primary font-bold">
            <div>Rs.{item.rate}/{item.unit}</div>
            <div className="flex gap-1 items-center"><IoLocationOutline className="size-4" />KTM</div>
          </div>
          <div className="flex justify-between">
            <div className="gap-2 inline-flex items-center">
              <span>{item.rating}</span>
              <div className="inline-flex items-center text-yellow-500 gap-0.5"><IoStar /><IoStar /><IoStar /><IoStar /><IoStarHalf /></div>
            </div>
            <div className="flex gap-2">
              <div className="text-sm inline-flex items-center">{item.lister}</div>
              <div style={{ backgroundImage: `url(${item.listerProfile})` }}
                className="size-7 bg-cover bg-center bg-no-repeat rounded-full" >
              </div>
            </div>
            {/* <RaBadge badgeText="VERIFIED" icon={<IoShieldCheckmarkOutline />} iconPosition="left" /> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RaItemPreviewCard;