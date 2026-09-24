import RaInput from "../../../../../components/input/RaInput";
import LocationPicker from "../../../../../components/maps/RaLocationPicker";

export type RequestToRentFormValue = {
  startDate: string;
  endDate: string;
  meetupLocation: string;
  meetupLatitude?: number;
  meetupLongitude?: number;
  note?: string;
};

function RequestToRentForm({
  value,
  onChange,
}: {
  value: RequestToRentFormValue;
  onChange: (data: RequestToRentFormValue) => void;
}) {
  const updateField = (field: keyof RequestToRentFormValue, fieldValue: string) => {
    const next = {
      ...value,
      [field]: fieldValue,
    };
    if (field === "startDate" && (!next.endDate || next.endDate < fieldValue)) {
      next.endDate = fieldValue;
    }
    onChange(next);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          Rental Duration (Per Day)
        </div>
        <p className="text-sm text-muted">
          Pickup and return are daytime. The same start and end date counts as 1 day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RaInput
            type="date"
            name="startDate"
            label="Start Date"
            value={value.startDate}
            min={today}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
          <RaInput
            type="date"
            name="endDate"
            label="End Date"
            value={value.endDate}
            min={value.startDate || today}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">
          Preferred meetup location
        </div>
        <div className="font-medium">
          Choose your preferred meetup location
        </div>

        <LocationPicker
          value={
            value.meetupLocation
              ? {
                address: value.meetupLocation,
                lat: value.meetupLatitude ?? 0,
                lng: value.meetupLongitude ?? 0,
              }
              : null
          }
          onChange={(location) =>
            onChange({
              ...value,
              meetupLocation: location.address,
              meetupLatitude: location.lat,
              meetupLongitude: location.lng,
            })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-semibold text-xl">Note to the owner</div>
        <textarea
          className="bg-surface border border-muted/20 p-3 rounded-2xl outline-0 min-h-24"
          placeholder="Introduce yourself and how you will use the item (optional)"
          value={value.note || ""}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
        />
      </div>
    </div>
  );
}

export default RequestToRentForm;
