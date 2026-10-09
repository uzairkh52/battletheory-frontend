'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapPicker to prevent SSR window errors in Next.js
const MapPicker = dynamic(() => import('@/components/admin/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-black/40 border border-gray-800 rounded flex items-center justify-center text-xs text-amber-500">[ LOADING RADAR MAP... ]</div>,
});

interface PhaseInput {
  name: string;
  description: string;
}

interface BattleFormFieldsProps {
  formData: {
    title: string;
    slug: string;
    summary: string;
    description: string;
    categoryId: string;
    locationName: string;
    year: number;
    latitude: number;
    longitude: number;
    featuredImage: string;
  };
  categories: any[];
  phases: PhaseInput[];
  onChange: (field: string, value: any) => void;
  onAddPhase: () => void;
  onRemovePhase: (index: number) => void;
  onPhaseChange: (index: number, field: keyof PhaseInput, value: string) => void;
}

export default function BattleFormFields({
  formData,
  categories,
  phases,
  onChange,
  onAddPhase,
  onRemovePhase,
  onPhaseChange,
}: BattleFormFieldsProps) {

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1 uppercase">Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Battle of Philippine Sea"
            value={formData.title}
            onChange={(e) => {
              const val = e.target.value;
              onChange('title', val);
              onChange('slug', slugify(val));
            }}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 uppercase">Slug</label>
          <input
            type="text"
            required
            placeholder="battle-slug"
            value={formData.slug}
            onChange={(e) => onChange('slug', slugify(e.target.value))}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
          />
        </div>
      </div>

      {/* Featured Image URL */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Featured Image URL</label>
        <input
          type="url"
          placeholder="https://example.com/battle-image.jpg"
          value={formData.featuredImage}
          onChange={(e) => onChange('featuredImage', e.target.value)}
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />
      </div>

      {/* Year, Category, Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-400 mb-1 uppercase">Year</label>
          <input
            type="number"
            required
            placeholder="1944"
            value={formData.year}
            onChange={(e) => onChange('year', Number(e.target.value))}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 uppercase">Category</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => onChange('categoryId', e.target.value)}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
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
            onChange={(e) => onChange('locationName', e.target.value)}
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
          />
        </div>
      </div>

      {/* Interactive Map Picker Section */}
      <div className="border-t border-gray-800 pt-4">
        <MapPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onChange={onChange}
        />
      </div>

      {/* 🌟 Summary Field (Added back so it renders properly) */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Summary</label>
        <input
          type="text"
          required
          placeholder="Short briefing / summary..."
          value={formData.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Description</label>
        <textarea
          rows={3}
          required
          placeholder="Detailed engagement history..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />
      </div>

      {/* Tactical Phases Section */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-amber-500 font-bold uppercase">Tactical Phases</h3>
          <button
            type="button"
            onClick={onAddPhase}
            className="text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded"
          >
            + ADD PHASE
          </button>
        </div>
        {phases.map((phase, idx) => (
          <div key={idx} className="p-3 bg-black/50 border border-gray-800 rounded mb-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500">PHASE #{idx + 1}</span>
              {phases.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemovePhase(idx)}
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
              onChange={(e) => onPhaseChange(idx, 'name', e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-white text-xs outline-none"
            />
            <textarea
              rows={2}
              placeholder="Phase Details..."
              value={phase.description}
              onChange={(e) => onPhaseChange(idx, 'description', e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-white text-xs outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}