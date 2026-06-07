import { IoArrowForward } from "react-icons/io5"
import { Link } from "react-router-dom"
import RaItemPreviewContainer from "../container/RaItemPreviewContainer"
import RaItemPreviewCard from "../card/RaItemPreviewCard"

export interface IListingSectionProps {
  sectionTitle?: string,
  redirectUrl?: string,
  listItems?: ListingItem[],
  styleClass?: string,
}

interface ListingItem {
  id: number;
  title: string;
  rate: number;
  unit: string;
  location: string;
  image: string;
}

const ListingsSection = ({
  sectionTitle,
  redirectUrl,
  listItems = [],
  styleClass,
}: IListingSectionProps) => {
  return (
    <div className={`rounded-4xl py-4 md:py-8 ${styleClass}`} >
      <div className="flex justify-between items-end">
        <h3 className="text-lg md:text-xl lg:text-3xl font-bold">{sectionTitle}</h3>
        <Link to={`${redirectUrl}`} className="flex gap-2 text-xs md:text-base text-primary hover:underline">
          View All<IoArrowForward />
        </Link>
      </div>
      <RaItemPreviewContainer>
        {listItems.map((item) => (
          <RaItemPreviewCard item={item} />
        ))}
      </RaItemPreviewContainer>
    </div >
  )
}

export default ListingsSection