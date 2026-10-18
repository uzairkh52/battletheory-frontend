'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBattle, updateBattle } from '@/store/slices/battleSlice';
import BattleFormFields from './battle/BattleFormFields';
import API from '@/lib/api';
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
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

interface PhaseInput {
  name: string;
  description: string;
}

interface BattleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBattle?: any | null;
}

export default function BattleFormModal({ isOpen, onClose, editingBattle }: BattleFormModalProps) {
  const dispatch = useAppDispatch();
  const { categories, creating: isCreating, updating: isUpdating } = useAppSelector((state) => state.battles);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    categoryId: '',
    locationName: '',
    year: new Date().getFullYear(),
    latitude: 28.2072,
    longitude: -177.3735,
    featuredImage: '',
  });

  const [phases, setPhases] = useState<PhaseInput[]>([{ name: '', description: '' }]);

  // Category State Handler for Inline Add
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setLocalCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isOpen]);

  // Populating form with absolute fallback for summary
  useEffect(() => {
    if (editingBattle) {
      const matchedCategory =
        editingBattle.categoryId?._id ||
        editingBattle.categoryId ||
        editingBattle.category?._id ||
        editingBattle.category ||
        editingBattle.theater?._id ||
        editingBattle.theater ||
        '';

      const extractedSummary =
        editingBattle.summary ||
        editingBattle.shortSummary ||
        editingBattle.overview ||
        editingBattle.briefing ||
        (editingBattle.description ? editingBattle.description.substring(0, 150) + '...' : '');

      setFormData({
        title: editingBattle.title || editingBattle.name || '',
        slug: editingBattle.slug || '',
        summary: extractedSummary,
        description: editingBattle.description || '',
        categoryId: typeof matchedCategory === 'object' ? matchedCategory.name : matchedCategory,
        locationName: editingBattle.location || editingBattle.locationName || '',
        year: editingBattle.year ? Number(editingBattle.year) : new Date().getFullYear(),
        latitude: editingBattle.coordinates?.lat ?? editingBattle.coordinates?.[0] ?? 28.2072,
        longitude: editingBattle.coordinates?.lng ?? editingBattle.coordinates?.[1] ?? -177.3735,
        featuredImage: editingBattle.featuredImage || '',
      });

      if (editingBattle.tacticalPhases && editingBattle.tacticalPhases.length > 0) {
        setPhases(
          editingBattle.tacticalPhases.map((p: any) => ({
            name: p.phaseName || p.name || '',
            description: p.details || p.description || '',
          }))
        );
      } else if (editingBattle.phases && editingBattle.phases.length > 0) {
        setPhases(
          editingBattle.phases.map((p: any) => ({
            name: p.name || p.phaseName || '',
            description: p.description || p.details || '',
          }))
        );
      } else {
        setPhases([{ name: '', description: '' }]);
      }
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        description: '',
        categoryId: '',
        locationName: '',
        year: new Date().getFullYear(),
        latitude: 28.2072,
        longitude: -177.3735,
        featuredImage: '',
      });
      setPhases([{ name: '', description: '' }]);
    }
  }, [editingBattle, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPhase = () => {
    setPhases([...phases, { name: '', description: '' }]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index: number, field: keyof PhaseInput, value: string) => {
    const updated = [...phases];
    updated[index][field] = value;
    setPhases(updated);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-');
      const res = await API.post('/categories', { name: newCatName, slug });
      await fetchCategories();
      setFormData((prev) => ({ ...prev, categoryId: res.data.name || newCatName }));
      setNewCatName('');
      setShowAddCat(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${catId}`);
      await fetchCategories();
      setFormData((prev) => ({ ...prev, categoryId: '' }));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
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
      alert('Please select a Category/Theater!');
      return;
    }

    const validPhases = phases.filter((p) => p.name && p.name.trim() !== '');
    const battlePayload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      description: formData.description,
      category: formData.categoryId,
      theater: formData.categoryId,
      location: formData.locationName,
      year: Number(formData.year),
      coordinates: [Number(formData.latitude), Number(formData.longitude)] as [number, number],
      phases: validPhases,
      tacticalPhases: validPhases.map((p) => ({ phaseName: p.name, details: p.description })),
      featuredImage: formData.featuredImage,
    };

    let resultAction;
    if (editingBattle) {
      resultAction = await dispatch(
        updateBattle({ id: editingBattle._id, battleData: battlePayload })
      );
    } else {
      resultAction = await dispatch(createBattle(battlePayload));
    }

    if (
      (editingBattle && updateBattle.fulfilled.match(resultAction)) ||
      (!editingBattle && createBattle.fulfilled.match(resultAction))
    ) {
      onClose();
    } else {
      alert((resultAction.payload as string) || 'Failed to save battle record');
    }
  };

  const availableCategories = categories?.length > 0 ? categories : localCategories;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-[#111827] border border-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
            {editingBattle ? 'Edit Battle Record' : 'Create Battle Record'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <BattleFormFields
            formData={formData}
            categories={availableCategories}
            phases={phases}
            newCatName={newCatName}
            showAddCat={showAddCat}
            setNewCatName={setNewCatName}
            setShowAddCat={setShowAddCat}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onChange={handleFieldChange}
            onAddPhase={handleAddPhase}
            onRemovePhase={handleRemovePhase}
            onPhaseChange={handlePhaseChange}
          />

          <div className="space-y-2 bg-black/40 p-3 border border-gray-800/80 rounded font-mono">
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

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-800 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : editingBattle ? 'Update Battle' : 'Save Battle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}