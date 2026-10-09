'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom tactical marker icon matching your theme
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ 
  latitude, 
  longitude, 
  onLocationChange 
}: { 
  latitude: number; 
  longitude: number; 
  onLocationChange: (lat: number, lng: number) => void 
}) {
  useMapEvents({
    click(e) {
      onLocationChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} icon={customIcon} />
  ) : null;
}

export default function MapPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number;
  longitude: number;
  onChange: (field: string, value: any) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-72 bg-[#111827] border border-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ INITIALIZING TACTICAL MAP PICKER... ]
        </p>
      </div>
    );
  }

  const defaultLat = latitude || 15;
  const defaultLng = longitude || 130;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="text-amber-500 font-bold uppercase flex items-center gap-2">
          <span>📍</span> Tactical Map Picker (Click map to drop coordinates)
        </span>
        <span className="text-gray-400 font-mono">
          Lat: {latitude || 'N/A'}, Lng: {longitude || 'N/A'}
        </span>
      </div>

      <div className="h-72 w-full rounded-lg overflow-hidden border border-gray-800 relative z-0">
        <MapContainer
          center={[defaultLat, defaultLng]}
          zoom={3}
          style={{ height: '100%', width: '100%', background: '#0b0f19' }}
        >
          {/* Clean dark tactical tile layer matching your main archive visualizer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="brightness-90 contrast-125 hue-rotate-180 invert"
          />
          <LocationMarker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              onChange('latitude', lat);
              onChange('longitude', lng);
            }}
          />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1 uppercase text-[10px]">Map Latitude</label>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => onChange('latitude', parseFloat(e.target.value) || 0)}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs font-mono"
            placeholder="15.0000"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 uppercase text-[10px]">Map Longitude</label>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => onChange('longitude', parseFloat(e.target.value) || 0)}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs font-mono"
            placeholder="130.0000"
          />
        </div>
      </div>
    </div>
  );
}