'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const customIcon = L.divIcon({
  className: 'custom-tactical-pin',
  html: `<div style="
    width: 14px; 
    height: 14px; 
    background-color: #f59e0b; 
    border: 2px solid #000; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #f59e0b;
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface Battle {
  _id: string;
  name?: string;
  title?: string;
  slug?: string;
  year?: string | number;
  location?: string;
  theater?: string;
  coordinates?: { lat: number; lng: number };
}

interface MapProps {
  battles: Battle[];
  selectedBattle: Battle | null;
  onSelectBattle: (battle: Battle) => void;
}

// Map Recenter Controller
function MapRecenter({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();

  useEffect(() => {
    if (typeof lat === 'number' && typeof lng === 'number') {
      map.flyTo([lat, lng], 5, {
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);

  return null;
}

export default function BattleMap({ battles, selectedBattle, onSelectBattle }: MapProps) {
  const selectedLat = selectedBattle?.coordinates?.lat;
  const selectedLng = selectedBattle?.coordinates?.lng;

  const defaultCenter: [number, number] = 
    typeof selectedLat === 'number' && typeof selectedLng === 'number'
      ? [selectedLat, selectedLng]
      : [20, 0];

  return (
    <div className="w-full h-[380px] rounded-lg overflow-hidden border border-gray-800 relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#0b0f19' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic FlyTo Controller */}
        <MapRecenter lat={selectedLat} lng={selectedLng} />

        {battles.map((b) => {
          if (
            typeof b.coordinates?.lat !== 'number' ||
            typeof b.coordinates?.lng !== 'number'
          ) {
            return null;
          }

          const title = b.title || b.name || 'Battle Engagement';

          return (
            <Marker
              key={b._id}
              position={[b.coordinates.lat, b.coordinates.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectBattle(b),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <h4 className="font-bold text-xs uppercase text-black">{title}</h4>
                  <p className="text-[10px] text-gray-700 font-mono">
                    {b.location} ({b.year || 'N/A'})
                  </p>
                  <Link
                    href={`/battles/${b.slug || b._id}`}
                    className="inline-block text-[10px] font-bold text-amber-600 underline uppercase mt-1"
                  >
                    View Full Briefing →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}