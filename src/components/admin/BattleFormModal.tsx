'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBattle } from '@/store/slices/battleSlice';

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
        coordinates: [formData.latitude, formData.longitude],
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

          {/* Map Coordinates */}
          <div className="grid grid-cols-2 gap-4 bg-black/40 p-3 border border-gray-800/80 rounded">
            <div>
              <label className="block text-amber-500/80 text-[10px] mb-1 uppercase">
                Map Latitude (e.g., 15.0)
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
                Map Longitude (e.g., 130.0)
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