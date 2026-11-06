'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBattle, updateBattle } from '@/store/slices/battleSlice';
import BattleFormFields from './battle/BattleFormFields';
import API from '@/lib/api';

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
    videoEmbed: '',
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
        videoEmbed: editingBattle.videoEmbed || '',
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
        videoEmbed: '',
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
      videoEmbed: formData.videoEmbed,
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
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
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

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-800 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded disabled:opacity-50 cursor-pointer"
            >
              {isCreating || isUpdating ? 'Saving...' : editingBattle ? 'Update Battle' : 'Save Battle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}