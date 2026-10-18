'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import BattleFormFields from '@/components/admin/battle/BattleFormFields';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticleCategories } from '@/store/slices/articleSlice';

export default function BattleForm() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.articles);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    summary: '',
    year: '' as unknown as number,
    locationName: '',
    theater: '',
    description: '',
    latitude: 0,
    longitude: 0,
  });

  const [phases, setPhases] = useState([{ name: '', description: '' }]);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Quick Add Category States
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  useEffect(() => {
    dispatch(fetchArticleCategories());
  }, [dispatch]);

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

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    try {
      const res = await API.post('/categories', { name: newCatName, slug });
      await dispatch(fetchArticleCategories());
      setFormData((prev) => ({ ...prev, theater: res.data.name || newCatName }));
      setNewCatName('');
      setShowAddCat(false);
      setStatus({ type: 'success', msg: 'Category added successfully!' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.error || err.response?.data?.message || 'Failed to add category.',
      });
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await API.delete(`/categories/${catId}`);
      await dispatch(fetchArticleCategories());
      setFormData((prev) => ({ ...prev, theater: '' }));
      setStatus({ type: 'success', msg: 'Category deleted successfully!' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.error || err.response?.data?.message || 'Failed to delete category.',
      });
    }
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
        coordinates: { lat: formData.latitude, lng: formData.longitude },
        phases: phases,
      });

      setStatus({ type: 'success', msg: 'Battle archive added successfully!' });
      setFormData({
        title: '',
        slug: '',
        featuredImage: '',
        summary: '',
        year: '' as unknown as number,
        locationName: '',
        theater: '',
        description: '',
        latitude: 0,
        longitude: 0,
      });
      setPhases([{ name: '', description: '' }]);
    } catch (err: any) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to add battle.',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4 font-mono"
    >
      <h3 className="text-lg font-bold text-white mb-2 uppercase">
        Archive New Battle
      </h3>

      {status.msg && (
        <div
          className={`p-3 rounded text-xs border ${
            status.type === 'success'
              ? 'bg-green-900/30 border-green-800 text-green-400'
              : 'bg-red-900/30 border-red-800 text-red-400'
          }`}
        >
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
        newCatName={newCatName}
        showAddCat={showAddCat}
        setNewCatName={setNewCatName}
        setShowAddCat={setShowAddCat}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory} // 🌟 Yeh prop yahan miss ho gaya tha, ab add kar diya hai!
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

      <button
        type="submit"
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
      >
        Save Battle Data
      </button>
    </form>
  );
}