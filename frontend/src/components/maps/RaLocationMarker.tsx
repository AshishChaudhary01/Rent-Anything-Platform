import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

type RentalType = "daily" | "hourly";

interface RequestToRentFormProps {
  rentalType: RentalType;
}

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
}

const mockLocations: LocationSuggestion[] = [
  {
    name: "Lazimpat, Kathmandu",
    lat: 27.7296,
    lng: 85.3247,
  },
  {
    name: "Baluwatar, Kathmandu",
    lat: 27.7332,
    lng: 85.3327,
  },
  {
    name: "Maharajgunj, Kathmandu",
    lat: 27.7394,
    lng: 85.3363,
  },
];

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: LatLngExpression;
  onPositionChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} />;
}

function RequestToRentForm({
  rentalType,
}: RequestToRentFormProps) {
  const [search, setSearch] = useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);

  const [position, setPosition] =
    useState<LatLngExpression>([
      27.7172,
      85.324,
    ]);

  const filteredLocations = mockLocations.filter((location) =>
    location.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLocationSelect = (
    location: LocationSuggestion
  ) => {
    setSelectedLocation(location);
    setSearch(location.name);

    setPosition([
      location.lat,
      location.lng,
    ]);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Rental Duration */}
      <div className="bg-white border border-light-gray rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          Rental Duration
        </h3>

        {rentalType === "daily" ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">
                Start Date
              </label>

              <input
                type="date"
                className="w-full border border-light-gray rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                End Date
              </label>

              <input
                type="date"
                className="w-full border border-light-gray rounded-lg px-3 py-2"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">
                Start Time
              </label>

              <input
                type="datetime-local"
                className="w-full border border-light-gray rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                End Time
              </label>

              <input
                type="datetime-local"
                className="w-full border border-light-gray rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pickup Location */}
      <div className="bg-white border border-light-gray rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          Pickup Location
        </h3>

        <div className="relative">
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-light-gray rounded-lg px-3 py-2"
          />

          {search && (
            <div className="absolute top-full left-0 right-0 bg-white border border-light-gray rounded-lg mt-1 shadow-md z-50">
              {filteredLocations.map(
                (location) => (
                  <button
                    key={location.name}
                    type="button"
                    onClick={() =>
                      handleLocationSelect(
                        location
                      )
                    }
                    className="w-full text-left px-4 py-3 hover:bg-bg"
                  >
                    {location.name}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom
            className="h-80 w-full rounded-lg overflow-hidden"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
              position={position}
              onPositionChange={(lat, lng) => {
                setPosition([lat, lng]);
              }}
            />
          </MapContainer>
        </div>

        {selectedLocation && (
          <div className="mt-3 text-sm text-muted">
            Selected:
            {" "}
            {selectedLocation.name}
          </div>
        )}
      </div>

      {/* Optional Note */}
      <div className="bg-white border border-light-gray rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          Note to Owner
        </h3>

        <textarea
          rows={4}
          placeholder="Any special requests or questions? (Optional)"
          className="w-full border border-light-gray rounded-lg px-3 py-2 resize-none"
        />
      </div>
    </div>
  );
}

export default RequestToRentForm;