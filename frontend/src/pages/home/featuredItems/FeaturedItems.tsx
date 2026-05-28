import { Link } from "react-router-dom";
import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import { IoArrowForward } from "react-icons/io5";
import RaContainerXS from "../../../components/container/RaContainerXS";
import { ladder01, pressureWasher01, profile01, tent01 } from "../../../utils/images";
import RaItemPreviewContainer from "../../../components/container/RaItemPreviewContainer";
import RaItemPreviewCard from "../../../components/card/RaItemPreviewCard";

const listItems = [
  {
    id: 1,
    image: ladder01,
    title: "A Title that is very very very very very very long",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 1000,
    unit: "day",
    rating: 4.6,
    listerProfile: profile01
  },
  {
    id: 2,
    image: tent01,
    title: "Demo Title",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 1000,
    unit: "day",
    rating: 4.6,
    listerProfile: profile01
  },
  {
    id: 3,
    image: pressureWasher01,
    title: "Demo Title",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 1000,
    unit: "day",
    rating: 4.6,
    listerProfile: profile01
  },
  {
    id: 4,
    image: ladder01,
    title: "Demo Title",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 1000,
    unit: "day",
    rating: 4.6,
    listerProfile: profile01
  },
  {
    id: 5,
    image: tent01,
    title: "Demo Title",
    description: "Demo description. This is a great item for xyz. It is well maintained and in good condition.",
    lister: "Shyam Rai",
    rate: 1000,
    unit: "day",
    rating: 4.1,
    listerProfile: profile01
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
              <RaContainerXS>
                <RaItemPreviewCard item={item} />
              </RaContainerXS>
            ))}
          </RaItemPreviewContainer>
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default FeaturedItems;