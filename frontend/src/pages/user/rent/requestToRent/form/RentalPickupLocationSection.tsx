import RaCard from "../../../../../components/card/RaCard"

function RentalPickupLocationSection() {
  return (
    <RaCard styleClass="flex flex-col gap-4">

      <h3 className="font-bold text-lg">
        Pickup Location
      </h3>
      <RaSearchbar
        value={query}
        onChange={...}
      placeholder="Search location"
  />

      <LocationSuggestions />

      <LocationMap />

    </RaCard>
  )
}

export default RentalPickupLocationSection;