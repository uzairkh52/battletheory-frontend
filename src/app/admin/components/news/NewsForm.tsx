'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createNews } from '@/store/slices/newsSlice';

export default function NewsForm() {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.news);

  const [formData, setFormData] = useState({
    title: '',
    category: 'MILITARY AI & DEFENSE',
    source: '',
    sourceUrl: '',
    summary: '',
    content: '',
    isPublished: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Redux Thunk Dispatch to POST /api/news
    const resultAction = await dispatch(createNews(formData));

    if (createNews.fulfilled.match(resultAction)) {
      setFormData({
        title: '',
        category: 'MILITARY AI & DEFENSE',
        source: '',
        sourceUrl: '',
        summary: '',
        content: '',
        isPublished: true,
      });
      alert('News item created and published successfully!');
    } else {
      alert((resultAction.payload as string) || 'Failed to publish news item.');
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 text-white font-mono">
      <div className="border-b border-gray-800 pb-3 mb-6">
        <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
          Create Defense Intelligence News
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Publish automated or manual defense tech & military AI briefings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">News Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Italy taps state-owned firms to build two naval destroyers"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-1 uppercase font-bold">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
            >
              <option value="MILITARY AI & DEFENSE">MILITARY AI & DEFENSE</option>
              <option value="AUTONOMOUS SYSTEMS">AUTONOMOUS SYSTEMS</option>
              <option value="NAVAL ENGAGEMENTS">NAVAL ENGAGEMENTS</option>
              <option value="CYBER WARFARE">CYBER WARFARE</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 uppercase font-bold">Source Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Defense News / Reuters"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">Source Link (URL)</label>
          <input
            type="url"
            placeholder="https://defensenews.com/..."
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">Short Summary</label>
          <textarea
            rows={2}
            required
            placeholder="Briefing snippet shown on news page..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full bg-black/60 border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-1 uppercase font-bold">Full Content (Optional)</label>
          <textarea
            rows={4}
            placeholder="Detailed intelligence report..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
            {creating ? 'Saving...' : 'Publish Intelligence Record'}
          </button>
        </div>
      </form>
    </div>
  );
}