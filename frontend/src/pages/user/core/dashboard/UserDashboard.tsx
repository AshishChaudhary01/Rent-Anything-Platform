import RaCategoryBar from "../../../../components/categoryBar/CategoryBar"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import ListingsSection from "../../../../components/listingsSection/ListingsSection"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { catalog } from "../../../../data/catalog"

const featured = catalog.slice(0, 10)
const adventure = catalog.filter((i) => i.category === "outdoor" || i.category === "adventure-tools").slice(0, 10)
const tools = catalog.filter((i) => i.category === "adventure-tools").slice(0, 10)
const home = catalog.filter((i) => i.category === "home").slice(0, 10)

const UserDashboard = () => {
  return (
    <div className="bg-bg">
      <RaContainer>
        <RaContainerPadding>
          <div>
            <div className="flex flex-col gap-y-2">
              <RaSearchBar placeholderText="Search for tools, gears, or appliances..." />
              <RaCategoryBar />
            </div>
            <ListingsSection sectionTitle="Featured" redirectUrl="/user/category/all" listItems={featured} />
            <ListingsSection sectionTitle="Adventure gear" redirectUrl="/user/category/outdoor" listItems={adventure} />
            <ListingsSection sectionTitle="Essential tools" redirectUrl="/user/category/adventure-tools" listItems={tools} />
            <ListingsSection sectionTitle="Home living" redirectUrl="/user/category/home" listItems={home} />
          </div>
        </RaContainerPadding>
      </RaContainer>
    </div>
  )
}

export default UserDashboard
