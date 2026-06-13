import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { IoLocation } from "react-icons/io5";

export interface SelectedLocation {
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value?: SelectedLocation | null;
  onChange?: (location: SelectedLocation) => void;
}

/* ---------------- KATHMANDU BOUNDS ---------------- */
const ktmBounds: [[number, number], [number, number]] = [
  [27.60, 85.20],
  [27.80, 85.45],
];

/* ---------------- REVERSE GEOCODE ---------------- */
const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data.display_name || `${lat}, ${lng}`;
};

/* ---------------- SEARCH ---------------- */
const searchLocations = async (query: string) => {
  if (!query) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${query}`
  );

  const data = await res.json();

  return data
    .map((item: any) => ({
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
};

/* ---------------- MAP CENTER ---------------- */
function MapCenter({
  position,
}: {
  position: LatLngExpression;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

/* ---------------- MAP CLICK HANDLER ---------------- */
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

/* ---------------- COMPONENT ---------------- */
function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // const [selected, setSelected] =
  //   useState<SelectedLocation | null>(
  //     value ?? null
  //   );

  const [position, setPosition] =
    useState<LatLngExpression>(
      value
        ? [value.lat, value.lng]
        : [27.7172, 85.324]
    );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------- SEARCH EFFECT ---------------- */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (search.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await searchLocations(search);

      setResults(data);
      setOpen(data.length > 0);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  /* ---------------- SELECT LOCATION ---------------- */
  const selectLocation = async (loc: any) => {
    const location: SelectedLocation = {
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
    };

    setSearch(loc.address);
    // setSelected(location);
    setPosition([loc.lat, loc.lng]);
    setOpen(false);
    setResults([]);

    onChange?.(location);
  };

  /* ---------------- MAP CLICK ---------------- */
  const handleMapClick = async (
    lat: number,
    lng: number
  ) => {
    const address = await reverseGeocode(lat, lng);

    const location: SelectedLocation = {
      address,
      lat,
      lng,
    };

    // setSelected(location);
    setSearch(address);
    setPosition([lat, lng]);
    setOpen(false);
    setResults([]);

    onChange?.(location);
  };

  /* ---------------- CURRENT LOCATION ---------------- */
  // const getCurrentLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (pos) => {
  //       const lat = pos.coords.latitude;
  //       const lng = pos.coords.longitude;

  //       const address = await reverseGeocode(lat, lng);

  //       const location: SelectedLocation = {
  //         address,
  //         lat,
  //         lng,
  //       };

  //       setSelected(location);
  //       setSearch(address);
  //       setPosition([lat, lng]);
  //       setOpen(false);

  //       onChange?.(location);
  //     }
  //   );
  // };

  return (
    <div className="flex flex-col gap-3 relative">

      {/* SEARCH */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search location..."
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* <button
          type="button"
          onClick={getCurrentLocation}
          className="mt-2 text-sm text-primary flex items-center gap-1"
        >
          <IoLocation className="size-4" />
          Use current location
        </button> */}

        {/* DROPDOWN */}
        {open && results.length > 0 && (
          <div className="absolute z-1000 w-full bg-white border rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => selectLocation(r)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {r.address}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAP */}
      <MapContainer
        center={position}
        zoom={14}
        className="h-80 rounded-lg z-0 cursor-grab active:cursor-grabbing"
        maxBounds={ktmBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


        <MapCenter position={position} />

        <MapClickHandler onMapClick={handleMapClick} />

        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend: (e: any) => {
              const lat = e.target.getLatLng().lat;
              const lng = e.target.getLatLng().lng;
              handleMapClick(lat, lng);
            },
          }}
        />
      </MapContainer>

      {/* SELECTED */}
      {/* {selected && (
        <div className="text-xs text-gray-600">
          Selected: {selected.address}
        </div>
      )} */}
    </div>
  );
}

export default LocationPicker;