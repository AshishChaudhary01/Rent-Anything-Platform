import RaCategoryBar from "../../../../components/categoryBar/CategoryBar"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import ListingsSection from "../../../../components/listingsSection/ListingsSection"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../../../../utils/images"


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
            <ListingsSection sectionTitle="Featured" listItems={listItems} />
            <ListingsSection sectionTitle="Adventure gear" listItems={listItems} />
            <ListingsSection sectionTitle="Essential tools" listItems={listItems} />
            <ListingsSection sectionTitle="Home living" listItems={listItems} />
          </div>
        </RaContainerPadding>
      </RaContainer>
    </div>
  )
}

export default UserDashboard