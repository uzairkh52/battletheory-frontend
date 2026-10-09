'use client';

import { useState } from 'react';
import API from '@/lib/api';
import BattleFormFields from '@/components/admin/battle/BattleFormFields';

export default function BattleForm() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    summary: '', // 🌟 Yahan summary add kar di hai taake error khatam ho jaye
    year: '',
    locationName: '',
    theater: 'European',
    description: '',
  });

  const [phases, setPhases] = useState([{ name: '', description: '' }]);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPhase = () => {
    setPhases([...phases, { name: '', description: '' }]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...phases];
    updated[index][field] = value;
    setPhases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    
    try {
      await API.post('/battles', { 
        name: formData.title, 
        slug: formData.slug,
        featuredImage: formData.featuredImage,
        summary: formData.summary,
        year: formData.year, 
        location: formData.locationName, 
        theater: formData.theater, 
        description: formData.description,
        coordinates: { lat: 0, lng: 0 }
      });

      setStatus({ type: 'success', msg: 'Battle archive added successfully!' });
      setFormData({
        title: '',
        slug: '',
        featuredImage: '',
        summary: '',
        year: '',
        locationName: '',
        theater: 'European',
        description: '',
      });
      setPhases([{ name: '', description: '' }]);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to add battle.' });
    }
  };

  const categories = [{ _id: 'European', name: 'European' }, { _id: 'Pacific', name: 'Pacific' }];

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4 font-mono">
      <h3 className="text-lg font-bold text-white mb-2 uppercase">Archive New Battle</h3>

      {status.msg && (
        <div className={`p-3 rounded text-xs border ${
          status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'
        }`}>
          {status.msg}
        </div>
      )}

      <BattleFormFields
        formData={{
          ...formData,
          categoryId: formData.theater,
        }}
        categories={categories}
        phases={phases}
        onChange={(field, val) => {
          if (field === 'categoryId') {
            handleFieldChange('theater', val);
          } else {
            handleFieldChange(field, val);
          }
        }}
        onAddPhase={handleAddPhase}
        onRemovePhase={handleRemovePhase}
        onPhaseChange={handlePhaseChange}
      />

      <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors">
        Save Battle Data
      </button>
    </form>
  );
}