import RaInput from "../../../../../components/input/RaInput";
import LocationPicker from "../../../../../components/maps/RaLocationPicker";

function RequestToRentForm() {
  return (
    <div className="flex flex-col gap-6">

      {/* ================= RENTAL DURATION (DAILY ONLY) ================= */}
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          Rental Duration (Per Day)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <RaInput
            type="date"
            name="startDate"
            label="Start Date"
            placeholderText="Select start date"
          />

          <RaInput
            type="date"
            name="endDate"
            label="End Date"
            placeholderText="Select end date"
          />

        </div>
      </div>

      {/* ================= MEETUP LOCATION ================= */}
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          Prefered meetup location
        </div>
        <div className="font-medium">
          Choose your preferred meetup Location
        </div>

        <LocationPicker />
      </div>
    </div>
  );
}

export default RequestToRentForm;