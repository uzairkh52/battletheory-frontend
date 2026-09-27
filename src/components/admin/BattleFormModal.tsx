'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBattle } from '@/store/slices/battleSlice';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Exact Tactical Glowing Radar Marker Icon
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

// Map Click Listener
function MapClickListener({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Modal Resize & Center Fixer for Leaflet
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

// Inline Tactical Dark Map Picker Component
function TacticalMapPicker({
  latitude,
  longitude,
  onSelect,
}: {
  latitude: number;
  longitude: number;
  onSelect: (lat: number, lng: number) => void;
}) {
  const centerPosition: [number, number] = [latitude, longitude];

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

        {/* Free Public Dark Tile Layer (No API Key Required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />

        {/* Tactical Selected Location Marker */}
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

// SSR Bypass for Map
const DynamicTacticalMapPicker = dynamic(() => Promise.resolve(TacticalMapPicker), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] bg-[#0b0f19] border border-gray-800 rounded flex items-center justify-center">
      <p className="text-xs font-mono text-amber-500 animate-pulse">
        [ INITIALIZING GEOSPATIAL RADAR & DARK MAP TILES... ]
      </p>
    </div>
  ),
});

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface PhaseInput {
  name: string;
  description: string;
}

interface BattleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BattleFormModal({ isOpen, onClose }: BattleFormModalProps) {
  const dispatch = useAppDispatch();
  const { categories, creating: isCreating } = useAppSelector((state) => state.battles);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    categoryId: '',
    locationName: '',
    year: new Date().getFullYear(),
    latitude: 15.0,
    longitude: 130.0,
  });

  const [phases, setPhases] = useState<PhaseInput[]>([
    { name: '', description: '' },
  ]);

  if (!isOpen) return null;

  const handleAddPhase = () => {
    setPhases([...phases, { name: '', description: '' }]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (
    index: number,
    field: keyof PhaseInput,
    value: string
  ) => {
    const updated = [...phases];
    updated[index][field] = value;
    setPhases(updated);
  };

  const handleSelectCoordinatesFromMap = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Please select a Category!');
      return;
    }

    const slug = generateSlug(formData.title);
    const validPhases = phases.filter((p) => p.name.trim() !== '');

    const resultAction = await dispatch(
      createBattle({
        title: formData.title,
        slug,
        summary: formData.summary,
        description: formData.description,
        category: formData.categoryId,
        location: formData.locationName,
        year: Number(formData.year),
        coordinates: [Number(formData.latitude), Number(formData.longitude)],
        phases: validPhases,
      })
    );

    if (createBattle.fulfilled.match(resultAction)) {
      setFormData({
        title: '',
        summary: '',
        description: '',
        categoryId: '',
        locationName: '',
        year: new Date().getFullYear(),
        latitude: 15.0,
        longitude: 130.0,
      });
      setPhases([{ name: '', description: '' }]);
      onClose();
    } else {
      alert((resultAction.payload as string) || 'Failed to create battle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
            Create Battle Record
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-400 mb-1 uppercase">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Battle of Philippine Sea"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 uppercase">Year</label>
              <input
                type="number"
                required
                placeholder="1944"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 uppercase">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
              >
                <option value="">-- SELECT --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase">Location Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Philippine Sea"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Tactical Map Location Picker Section */}
          <div className="space-y-2 bg-black/40 p-3 border border-gray-800/80 rounded">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-amber-500 text-[10px] uppercase font-bold tracking-wider">
                📍 TACTICAL MAP PICKER (CLICK MAP TO SELECT COORDINATES)
              </label>
              <span className="text-[10px] text-amber-500/80 font-mono">
                Lat: {formData.latitude}, Lng: {formData.longitude}
              </span>
            </div>

            <DynamicTacticalMapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onSelect={handleSelectCoordinatesFromMap}
            />

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-amber-500/80 text-[10px] mb-1 uppercase">
                  Map Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-amber-500/80 text-[10px] mb-1 uppercase">
                  Map Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 uppercase">Summary</label>
            <input
              type="text"
              required
              placeholder="Short briefing..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 uppercase">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed engagement history..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
            />
          </div>

          {/* Tactical Phases Section */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-amber-500 font-bold uppercase">Tactical Phases</h3>
              <button
                type="button"
                onClick={handleAddPhase}
                className="text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded"
              >
                + ADD PHASE
              </button>
            </div>

            {phases.map((phase, idx) => (
              <div
                key={idx}
                className="p-3 bg-black/50 border border-gray-800 rounded mb-2 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">PHASE #{idx + 1}</span>
                  {phases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhase(idx)}
                      className="text-red-400 text-[10px]"
                    >
                      REMOVE
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Phase Title (e.g. Initial Submarine Attack)"
                  value={phase.name}
                  onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-white text-xs outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Phase Details..."
                  value={phase.description}
                  onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-white text-xs outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded disabled:opacity-50"
            >
              {isCreating ? 'Saving...' : 'Save Battle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}