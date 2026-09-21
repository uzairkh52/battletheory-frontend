'use client';

import { useState } from 'react';
import {
  useGetArticlesQuery,
  useGetCategoriesQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} from '@/store/services/articleApi';

// Helper function to generate URL slug from title
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function ManageArticlesPage() {
  const { data: articles = [], isLoading, isError } = useGetArticlesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteArticle(id).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete article');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Please select a Category!');
      return;
    }

    const slug = generateSlug(formData.title);

    try {
      await createArticle({
        title: formData.title,
        slug: slug,
        summary: formData.summary,
        content: formData.content,
        category: formData.categoryId,
      }).unwrap();

      setIsModalOpen(false);
      setFormData({ title: '', summary: '', content: '', categoryId: '' });
    } catch (err: any) {
      console.error('Server Response Error:', err);
      alert(err?.data?.message || err?.data?.error || 'Failed to save article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Manage Articles
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded uppercase hover:bg-amber-400 transition-colors font-mono"
        >
          + Add Article
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ LOADING ARTICLES... ]
        </p>
      ) : isError ? (
        <div className="p-8 text-center border border-dashed border-red-900/50 rounded">
          <p className="text-xs font-mono text-red-500 uppercase">
            [ ERROR FETCHING ARTICLES FROM SERVER ]
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center hover:border-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-white uppercase">
                  {item.title}
                </h4>
                <p className="text-xs font-mono text-gray-500 line-clamp-1">
                  {item.summary || item.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-xs font-mono text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded transition-colors"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
                Create New Article
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
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
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
}