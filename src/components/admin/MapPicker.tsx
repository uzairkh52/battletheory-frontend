'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Marker Icon Path Issue
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onSelectLocation: (lat: number, lng: number) => void;
}

function LocationMarker({
  latitude,
  longitude,
  onSelectLocation,
}: MapPickerProps) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={[latitude, longitude]} icon={customIcon} />;
}

export default function MapPicker({
  latitude,
  longitude,
  onSelectLocation,
}: MapPickerProps) {
  return (
    <div className="h-48 w-full border border-gray-800 rounded overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={3}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onSelectLocation={onSelectLocation}
        />
      </MapContainer>
    </div>
  );
}