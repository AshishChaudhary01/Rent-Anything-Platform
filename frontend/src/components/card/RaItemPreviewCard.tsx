import { Link } from "react-router-dom";
import { ladder01 } from "../../utils/images";
import { IoCashOutline } from "react-icons/io5";

export interface ICardProps {
  item?: {
    id: number,
    title: string,
    rate: number,
    unit: string,
    image: string,
    location?: string,
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
  },
  styleClass,
}: ICardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl w-40 shrink-0 lg:w-auto lg:flex-[0_0_calc((100%-4*1.5rem)/5)] xl:flex-[0_0_calc((100%-5*1.5rem)/6)] p-0 hover:drop-shadow-sm ${styleClass}`}
    >
      <Link to={"/user/listing"}>
        <div style={{ backgroundImage: `url(${item.image})` }}
          className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-t-2xl"></div>
        <div className="flex flex-col p-2 gap-1">
          <div className="text-base md:text-lg font-semibold line-clamp-1">{item.title}</div>
          <div className="flex flex-col gap-y-0 md:gap-y-0.5 justify-between gap-x-2 text-sm md:text-base font-semibold">
            <div className="flex gap-2 items-center font-semibold text-primary"><IoCashOutline className="size-5" /> Rs.{item.rate}/{item.unit}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RaItemPreviewCard;