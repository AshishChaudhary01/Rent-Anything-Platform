import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"

export type RaMapPoint = {
  lat: number
  lng: number
  label?: string
}

interface RaMapViewProps {
  center: RaMapPoint
  markers?: RaMapPoint[]
  zoom?: number
  interactive?: boolean
  styleClass?: string
}

function MapSync({ center, zoom }: { center: RaMapPoint; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center.lat, center.lng, zoom, map])
  return null
}

function RaMapView({
  center,
  markers = [center],
  zoom = 14,
  interactive = true,
  styleClass = "h-48 md:h-64",
}: RaMapViewProps) {
  return (
    <div className={`ra-map-view overflow-hidden rounded-2xl ${styleClass}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        zoomControl={interactive}
        className="h-full w-full"
      >
        <MapSync center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={`${m.lat}-${m.lng}-${i}`} position={[m.lat, m.lng]}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default RaMapView
