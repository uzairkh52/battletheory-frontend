'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createNews,
  fetchNewsCategories,
  createNewsCategory,
  deleteNewsCategory,
} from '@/store/slices/newsSlice';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['image', 'link', 'video'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'image',
  'link',
  'video',
];

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

export default function NewsForm() {
  const dispatch = useAppDispatch();
  const {
    creating,
    categories,
    categoriesLoading,
    categorySaving,
    categoryError,
  } = useAppSelector((state) => state.news);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    dispatch(fetchNewsCategories(true));
  }, [dispatch]);

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
      image: formData.image.trim(),
      category: formData.category || 'Defense',
    };

    const resultAction = await dispatch(createNews(payload));

    if (createNews.fulfilled.match(resultAction)) {
      setFormData((prev) => ({
        ...INITIAL_FORM,
        category: prev.category,
      }));
      alert('Original news briefing created successfully!');
    } else {
      alert((resultAction.payload as string) || 'Failed to create news briefing.');
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 text-white font-mono">
      <div className="border-b border-gray-800 pb-3 mb-6">
        <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
          Create Original News Briefing
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Publish original editorial analysis and tactical assessments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
          {/* Article-style Category Add & Delete */}
          <div>
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
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  disabled={categorySaving}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddCategory();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-black font-bold px-3 text-xs uppercase rounded cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  {categorySaving ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
                >
                  <option value="" className="text-gray-500 bg-black">
                    {categoriesLoading ? '-- LOADING CATEGORIES --' : '-- SELECT CATEGORY --'}
                  </option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option
                        key={cat._id || cat.name}
                        value={cat.name}
                        className="bg-[#111827] text-white py-1"
                      >
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="text-gray-500">
                      No news categories found (+ Add New to create)
                    </option>
                  )}
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
                    className="bg-red-900/40 hover:bg-red-800 disabled:opacity-50 border border-red-800 text-red-400 font-bold px-3 text-xs rounded transition-colors cursor-pointer"
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

          <div>
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

        {/* Rich Text Editor (ArticleFormFields style) */}
        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">
            Full Content (Rich Text Editor) *
          </label>
          <div className="bg-white text-black rounded overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(contentValue) => setFormData({ ...formData, content: contentValue })}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder="Detailed news article body text..."
              className="min-h-[250px]"
            />
          </div>
        </div>

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

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded text-xs transition disabled:opacity-50"
          >
            {creating ? 'Saving...' : 'Publish Briefing'}
          </button>
        </div>
      </form>
    </div>
  );
}