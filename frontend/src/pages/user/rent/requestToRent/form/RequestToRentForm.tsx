import RaInput from "../../../../../components/input/RaInput";
import LocationPicker from "../../../../../components/maps/RaLocationPicker";

interface RequestToRentFormProps {
  value: {
    startDate: string;
    endDate: string;
    meetupLocation: string;
    note: string;
  };
  onChange: (data: any) => void;
}

function RequestToRentForm({
  value,
  onChange,
}: RequestToRentFormProps) {
  const updateField = (
    field: string,
    fieldValue: string
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };
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
            value={value.startDate}
            onChange={(e) =>
              updateField("startDate", e.target.value)
            }
          />

          <RaInput
            type="date"
            name="endDate"
            label="End Date"
            value={value.endDate}
            onChange={(e) =>
              updateField("endDate", e.target.value)
            }
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

        <LocationPicker
          value={
            value.meetupLocation
              ? {
                address: value.meetupLocation,
                lat: 0,
                lng: 0,
              }
              : null
          }
          onChange={(location) =>
            updateField(
              "meetupLocation",
              location.address
            )
          }
        />
      </div>
      {/* <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          Additional Note
        </div>

        <RaInput
          type="text"
          name="note"
          placeholderText="Any special instructions..."
          value={value.note}
          onChange={(e) =>
            updateField("note", e.target.value)
          }
        />
      </div> */}
    </div>
  );
}

export default RequestToRentForm;