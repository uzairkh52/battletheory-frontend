'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createArticle } from '@/store/slices/articleSlice';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleFormModal({ isOpen, onClose }: ArticleFormModalProps) {
  const dispatch = useAppDispatch();
  const { categories, creating: isCreating } = useAppSelector((state) => state.articles);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Please select a Category!');
      return;
    }

    const slug = generateSlug(formData.title);

    const resultAction = await dispatch(
      createArticle({
        title: formData.title,
        slug,
        summary: formData.summary,
        content: formData.content,
        category: formData.categoryId,
      })
    );

    if (createArticle.fulfilled.match(resultAction)) {
      setFormData({ title: '', summary: '', content: '', categoryId: '' });
      onClose();
    } else {
      alert((resultAction.payload as string) || 'Failed to save article');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
            Create New Article
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-[11px] uppercase text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="Article Headline"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase text-gray-400 mb-1">
              Summary
            </label>
            <input
              type="text"
              required
              placeholder="Short briefing summary..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase text-gray-400 mb-1">
              Category
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="">-- SELECT CATEGORY --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase text-gray-400 mb-1">
              Content
            </label>
            <textarea
              rows={5}
              required
              placeholder="Detailed article body text..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
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
              {isCreating ? 'Saving...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}