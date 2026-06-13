import RaCard from "../../../../../components/card/RaCard";
import RaInput from "../../../../../components/input/RaInput";

interface RentalDurationSectionProps {
  rentalType: "daily" | "hourly";
}

function RentalDurationSection({
  rentalType,
}: RentalDurationSectionProps) {
  return (
    <RaCard>
      <h3 className="font-bold text-lg">
        Rental Duration
      </h3>

      {rentalType === "daily" ? (
        <div className="grid md:grid-cols-2 gap-4">
          <RaInput
            type="date"
            name="startDate"
            label="Start Date"
          />

          <RaInput
            type="date"
            name="endDate"
            label="End Date"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <RaInput
            type="datetime-local"
            name="startTime"
            label="Start Time"
          />

          <RaInput
            type="datetime-local"
            name="endTime"
            label="End Time"
          />
        </div>
      )}
    </RaCard>
  );
}

export default RentalDurationSection