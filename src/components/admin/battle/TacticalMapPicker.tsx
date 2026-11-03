'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const tacticalMarkerIcon = L.divIcon({
  className: 'custom-tactical-pin',
  html: `
  <div style="
    width: 18px;
    height: 18px;
    background: #f59e0b;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 12px #f59e0b, 0 0 20px #f59e0b;
    cursor: pointer;
    transform: translate(-50%, -50%);
  "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapClickListener({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapResizeFixer({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView(center, map.getZoom());
    }, 250);
    return () => clearTimeout(timer);
  }, [map, center]);
  return null;
}

interface TacticalMapPickerProps {
  latitude: number;
  longitude: number;
  onSelect: (lat: number, lng: number) => void;
}

function TacticalMapPicker({ latitude, longitude, onSelect }: TacticalMapPickerProps) {
  const centerPosition: [number, number] = [latitude || 28.2072, longitude || -177.3735];
  return (
    <div className="w-full h-[280px] rounded border border-gray-800 overflow-hidden relative z-0">
      <MapContainer
        center={centerPosition}
        zoom={3}
        scrollWheelZoom={true}
        className="w-full h-full bg-[#0b0f19]"
      >
        <MapResizeFixer center={centerPosition} />
        <MapClickListener onSelect={onSelect} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Marker position={centerPosition} icon={tacticalMarkerIcon}>
          <Popup>
            <div className="text-black font-mono text-xs">
              <strong>TARGET COORDINATES</strong>
              <br />
              Lat: {latitude.toFixed(4)}
              <br />
              Lng: {longitude.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export const DynamicTacticalMapPicker = dynamic(() => Promise.resolve(TacticalMapPicker), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] bg-[#0b0f19] border border-gray-800 rounded flex items-center justify-center">
      <p className="text-xs font-mono text-amber-500 animate-pulse">
        [ INITIALIZING GEOSPATIAL RADAR & DARK MAP TILES... ]
      </p>
    </div>
  ),
});