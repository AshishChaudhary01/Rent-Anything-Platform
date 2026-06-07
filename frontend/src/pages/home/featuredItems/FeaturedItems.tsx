import { Link } from "react-router-dom";
import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import { IoArrowForward } from "react-icons/io5";
import RaItemPreviewContainer from "../../../components/container/RaItemPreviewContainer";
import RaItemPreviewCard from "../../../components/card/RaItemPreviewCard";
import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../../../utils/images";

const listItems = [
  {
    id: 1,
    image: ladder01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 2,
    image: tent01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 3,
    image: backpack01,
    title: "A Title that is very looooooooooooooooooooooong",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 4,
    image: tools01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 5,
    image: pressureWasher01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 6,
    image: ladder01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 7,
    image: tent01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 8,
    image: backpack01,
    title: "A Title that is very looooooooooooooooooooooong",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 9,
    image: tools01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
  {
    id: 10,
    image: pressureWasher01,
    title: "Demo title",
    rate: 1000,
    unit: "day",
    location: "KTM"
  },
]

const FeaturedItems = () => {
  return (
    <section className="py-16">
      <RaContainer>
        <RaContainerPadding>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl md:text-3xl lg:text-5xl font-extrabold">Featured Items</h3>
            <Link to={""} className="flex gap-2 text-xs md:text-base text-primary hover:underline">
              View All<IoArrowForward />
            </Link>
          </div>
          <RaItemPreviewContainer>
            {listItems.map((item) => (
              <RaItemPreviewCard item={item} />
            ))}
          </RaItemPreviewContainer>
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default FeaturedItems;