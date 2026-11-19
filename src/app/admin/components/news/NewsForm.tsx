'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createNews,
  updateNews,
  fetchNewsCategories,
  createNewsCategory,
  deleteNewsCategory,
  type NewsItem,
} from '@/store/slices/newsSlice';
import NewsRichEditor from './NewsRichEditor';

const INITIAL_FORM = {
  title: '',
  category: '',
  author: 'BattleTheory Editorial',
  image: '',
  summary: '',
  content: '',
  tacticalAnalysis: '',
  isPublished: true,
};

const isEmptyHtml = (html: string) => {
  const plainText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return plainText.length === 0;
};

interface NewsFormProps {
  initialData?: NewsItem | null;
  onSuccess?: (item: NewsItem) => void;
  onCancel?: () => void;
}

export default function NewsForm({ initialData = null, onSuccess, onCancel }: NewsFormProps) {
  const dispatch = useAppDispatch();
  const {
    creating,
    updating,
    categories,
    categoriesLoading,
    categorySaving,
    categoryError,
  } = useAppSelector((state) => state.news);

  const isEditMode = Boolean(initialData?._id);
  const isSubmitting = isEditMode ? updating : creating;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    dispatch(fetchNewsCategories(true));
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        author: initialData.author || 'BattleTheory Editorial',
        image: initialData.image || initialData.imageUrl || initialData.thumbnail || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        tacticalAnalysis: initialData.tacticalAnalysis || '',
        isPublished: initialData.isPublished ?? true,
      });
    } else {
      setFormData((prev) => ({
        ...INITIAL_FORM,
        category: prev.category || categories[0]?.name || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id]);

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0].name,
      }));
    }
  }, [categories, formData.category]);

  const selectedCategoryObj = categories.find(
    (cat) => cat.name === formData.category || cat._id === formData.category
  );

  const handleAddCategory = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    const resultAction = await dispatch(createNewsCategory({ name: trimmed }));

    if (createNewsCategory.fulfilled.match(resultAction)) {
      const createdName = resultAction.payload?.name || trimmed;
      setFormData((prev) => ({ ...prev, category: createdName }));
      setNewCatName('');
      setShowAddCat(false);
    } else {
      alert((resultAction.payload as string) || 'Failed to create news category.');
    }
  };

  const handleDeleteCategory = async (categoryNameOrId: string) => {
    const target = categories.find(
      (cat) => cat._id === categoryNameOrId || cat.name === categoryNameOrId
    );
    if (!target?._id) {
      alert('Selected category cannot be deleted.');
      return;
    }

    const confirmed = window.confirm(`Delete news category "${target.name}"?`);
    if (!confirmed) return;

    const resultAction = await dispatch(deleteNewsCategory({ id: target._id }));

    if (deleteNewsCategory.fulfilled.match(resultAction)) {
      const remaining = categories.filter((cat) => cat._id !== target._id);
      setFormData((prev) => ({
        ...prev,
        category: remaining[0]?.name || '',
      }));
    } else {
      alert((resultAction.payload as string) || 'Failed to delete news category.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEmptyHtml(formData.content)) {
      alert('Full content is required.');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim() || 'BattleTheory Editorial',
      image: formData.image.trim(),
      summary: formData.summary.trim(),
      category: formData.category || 'Defense',
    };

    if (isEditMode && initialData?._id) {
      const resultAction = await dispatch(
        updateNews({ id: initialData._id, newsData: payload })
      );

      if (updateNews.fulfilled.match(resultAction)) {
        alert('News briefing updated successfully!');
        onSuccess?.(resultAction.payload);
      } else {
        alert((resultAction.payload as string) || 'Failed to update news briefing.');
      }
      return;
    }

    const resultAction = await dispatch(createNews(payload));

    if (createNews.fulfilled.match(resultAction)) {
      setFormData((prev) => ({
        ...INITIAL_FORM,
        category: prev.category,
      }));
      alert('Original news briefing created successfully!');
      onSuccess?.(resultAction.payload);
    } else {
      alert((resultAction.payload as string) || 'Failed to create news briefing.');
    }
  };

  return (
    <div className="min-w-0 w-full bg-[#111827] border border-gray-800 rounded-lg p-5 sm:p-6 text-white font-mono">
      <div className="flex items-start justify-between gap-3 border-b border-gray-800 pb-3 mb-6">
        <div className="min-w-0">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
            {isEditMode ? 'Update News Briefing' : 'Create Original News Briefing'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isEditMode
              ? 'Modify existing editorial analysis, summary, or tactical assessment.'
              : 'Publish original editorial analysis and tactical assessments.'}
          </p>
        </div>

        {onCancel && isEditMode && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-400 hover:text-white underline cursor-pointer shrink-0"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs min-w-0">
        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">News Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Naval drone integration across carrier strike groups"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-400 uppercase font-bold">Category</label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddCat((prev) => !prev);
                }}
                className="text-[10px] text-amber-500 hover:underline uppercase font-bold cursor-pointer"
              >
                {showAddCat ? '- Cancel' : '+ Add New'}
              </button>
            </div>

            {showAddCat ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category Name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full min-w-0 bg-black border border-gray-800 rounded px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  disabled={categorySaving}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddCategory();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-black font-bold px-3 text-xs uppercase rounded cursor-pointer whitespace-nowrap"
                >
                  {categorySaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full min-w-0 bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
                >
                  <option value="" className="text-gray-500 bg-black">
                    {categoriesLoading ? '-- LOADING CATEGORIES --' : '-- SELECT CATEGORY --'}
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat._id || cat.name}
                      value={cat.name}
                      className="bg-[#111827] text-white py-1"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>

                {selectedCategoryObj && (
                  <button
                    type="button"
                    disabled={categorySaving}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCategory(selectedCategoryObj.name);
                    }}
                    title="Delete selected category"
                    className="bg-red-900/40 hover:bg-red-800 disabled:opacity-50 border border-red-800 text-red-400 font-bold px-3 text-xs rounded transition-colors cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {categoryError && (
              <p className="text-[11px] text-red-400 mt-1">{categoryError}</p>
            )}
          </div>

          <div className="min-w-0">
            <label className="block text-gray-400 mb-1 uppercase font-bold">Author</label>
            <input
              type="text"
              placeholder="BattleTheory Editorial"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">Cover Image URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">Short Summary *</label>
          <textarea
            rows={2}
            required
            placeholder="Concise briefing summary shown on the news feed..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <NewsRichEditor
          value={formData.content}
          onChange={(contentValue) => setFormData({ ...formData, content: contentValue })}
        />

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">
            Tactical Analysis (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="BattleTheory strategic or tactical assessment..."
            value={formData.tacticalAnalysis}
            onChange={(e) => setFormData({ ...formData, tacticalAnalysis: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="accent-amber-500 cursor-pointer"
          />
          <label htmlFor="isPublished" className="text-gray-300 font-bold uppercase cursor-pointer">
            Publish Directly
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          {onCancel && isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold uppercase rounded text-xs cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded text-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Saving...'
              : isEditMode
                ? 'Update Briefing'
                : 'Publish Briefing'}
          </button>
        </div>
      </form>
    </div>
  );
}