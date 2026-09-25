import { Link } from "react-router-dom";
import RaContainer from "../../../components/container/RaContainer";
import RaContainerPadding from "../../../components/container/RaContainerPadding";
import { IoArrowForward } from "react-icons/io5";
import RaItemPreviewContainer from "../../../components/container/RaItemPreviewContainer";
import RaItemPreviewCard from "../../../components/card/RaItemPreviewCard";
import { useListings } from "../../../hooks/queries/useListings";
import { toListingCard } from "../../../types/listing.types";
import RaPageLoader from "../../../components/feedback/RaPageLoader";

const FeaturedItems = () => {
  const { data, isPending, isError } = useListings({ size: 10, sort: "newest" })
  const items = (data?.items ?? []).map(toListingCard)

  return (
    <section className="py-16">
      <RaContainer>
        <RaContainerPadding>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl md:text-3xl lg:text-5xl font-extrabold">Featured Items</h3>
            <Link to="/user" className="flex gap-2 text-xs md:text-base text-primary hover:underline">
              View All<IoArrowForward />
            </Link>
          </div>
          {isPending ? (
            <RaPageLoader label="Loading listings…" />
          ) : isError ? (
            <p className="text-muted py-10">Could not load listings. Try again in a moment.</p>
          ) : items.length === 0 ? (
            <p className="text-muted py-10">No listings yet. Be the first to share an item nearby.</p>
          ) : (
            <RaItemPreviewContainer>
              {items.map((item) => (
                <RaItemPreviewCard key={item.id} item={item} />
              ))}
            </RaItemPreviewContainer>
          )}
        </RaContainerPadding>
      </RaContainer>
    </section>
  );
}

export default FeaturedItems;
