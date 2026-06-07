// import { IoBagHandleOutline } from "react-icons/io5"
// import RaCard from "../../../../components/card/RaCard"
// import { GoLaw } from "react-icons/go"

// const includedItems: string[] = ["Camera", "Lens", "Battery", "SD card"]
// const listingRules: string[] = ["No under water usage", "Report any issue immedietly", "Must handle with care"]

function ListingDescription() {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-lg md:text-xl font-bold">Description</p>
      <p className="font-light text-muted">
        Capture stunning detail with the Sony A7R IV. This professional-grade mirrorless camera
        features a 61MP full-frame sensor, perfect for high-resolution photography and 4K video.
        Whether you're shooting weddings, commercial projects, or breathtaking landscapes, this kit
        provides everything you need for a flawless production.
      </p>

      {/* <div className="flex flex-wrap gap-4">
        <RaCard bg="surface" styleClass="md:flex-1" round="round">
          <div className="flex gap-x-2">
            <IoBagHandleOutline className="size-4 text-primary" />
            <p className="font-bold">What's included</p>
          </div>
          <ul className="list-disc px-6 font-light text-muted text-sm">
            {includedItems.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </RaCard>
        <RaCard bg="surface" styleClass="md:flex-1" round="round">
          <div className="flex gap-x-2">
            <GoLaw className="size-4 text-primary" />
            <p className="font-bold">Rules</p>
          </div>
          <ul className="list-disc px-6 font-light text-muted text-sm">
            {listingRules.map((rule) => (
              <li>{rule}</li>
            ))}
          </ul>
        </RaCard>
      </div> */}
    </div>
  )
}

export default ListingDescription;