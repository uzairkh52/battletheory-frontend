'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.divIcon({
  className: 'custom-tactical-pin',
  html: `<div style="
    width: 16px; 
    height: 16px; 
    background-color: #f59e0b; 
    border: 2px solid #000; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #f59e0b;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface PickerProps {
  lat: number;
  lng: number;
  onSelectLocation: (lat: number, lng: number) => void;
}

function MapClickHandler({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onSelectLocation }: PickerProps) {
  const center: [number, number] = [lat || 20, lng || 0];

  return (
    <div className="w-full h-[250px] rounded-lg overflow-hidden border border-gray-700 relative z-0 mt-2">
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#0b0f19' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onSelectLocation={onSelectLocation} />

        {lat !== 0 && lng !== 0 && (
          <Marker position={[lat, lng]} icon={customIcon} />
        )}
      </MapContainer>
      <p className="text-[10px] text-gray-400 mt-1">
        * Click anywhere on the map above to select engagement coordinates automatically.
      </p>
    </div>
  );
}