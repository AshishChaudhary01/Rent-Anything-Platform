import RaCategoryBar from "../../../../components/categoryBar/CategoryBar"
import AccountSetupBanner from "../../../../components/account/AccountSetupBanner"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import ListingsSection from "../../../../components/listingsSection/ListingsSection"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { useListings } from "../../../../hooks/queries/useListings"
import { toListingCard } from "../../../../types/listing.types"

const UserDashboard = () => {
  const { data, isPending } = useListings({ size: 40, sort: "newest" })
  const cards = (data?.items ?? []).map(toListingCard)
  const featured = cards.slice(0, 10)
  const adventure = cards.filter((i) => i.category === "outdoor" || i.category === "adventure-tools").slice(0, 10)
  const tools = cards.filter((i) => i.category === "adventure-tools").slice(0, 10)
  const home = cards.filter((i) => i.category === "home").slice(0, 10)

  return (
    <div className="bg-bg">
      <RaContainer>
        <RaContainerPadding>
          <div>
            <div className="flex flex-col gap-y-4">
              <AccountSetupBanner />
              <RaSearchBar placeholderText="Search for tools, gears, or appliances..." />
              <RaCategoryBar />
            </div>
            {isPending ? (
              <div className="text-muted py-10">Loading listings…</div>
            ) : cards.length === 0 ? (
              <div className="text-muted py-10">No listings yet. Be the first to share an item nearby.</div>
            ) : (
              <>
                <ListingsSection sectionTitle="Featured" redirectUrl="/user/category/all" listItems={featured} />
                {adventure.length > 0 && (
                  <ListingsSection sectionTitle="Adventure gear" redirectUrl="/user/category/outdoor" listItems={adventure} />
                )}
                {tools.length > 0 && (
                  <ListingsSection sectionTitle="Essential tools" redirectUrl="/user/category/adventure-tools" listItems={tools} />
                )}
                {home.length > 0 && (
                  <ListingsSection sectionTitle="Home living" redirectUrl="/user/category/home" listItems={home} />
                )}
              </>
            )}
          </div>
        </RaContainerPadding>
      </RaContainer>
    </div>
  )
}

export default UserDashboard
