'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Trash2, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchNewsList,
  deleteNews,
  type NewsItem,
} from '@/store/slices/newsSlice';

import NewsForm from './../components/news/NewsForm';

export default function AdminNewsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, deleting } = useAppSelector((state) => state.news);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    dispatch(fetchNewsList({ page: 1, limit: 50, all: true }));
  }, [dispatch]);

  const handleEditClick = (news: NewsItem) => {
    setEditingNews(news);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (news: NewsItem) => {
    if (!news._id) return;
    const confirmed = window.confirm(`Delete briefing "${news.title}"?`);
    if (!confirmed) return;

    const resultAction = await dispatch(deleteNews(news._id));
    if (deleteNews.fulfilled.match(resultAction)) {
      if (editingNews?._id === news._id) {
        setEditingNews(null);
      }
    } else {
      alert((resultAction.payload as string) || 'Failed to delete news briefing.');
    }
  };

  return (
    <div className="min-w-0 w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 font-mono text-white">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
          Defense Intelligence News Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Create, publish, and manage original editorial briefings for BattleTheory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Create / Edit Form */}
        <div className="min-w-0 lg:col-span-7">
          <NewsForm
            initialData={editingNews}
            onCancel={() => setEditingNews(null)}
            onSuccess={() => {
              setEditingNews(null);
              dispatch(fetchNewsList({ page: 1, limit: 50, all: true }));
            }}
          />
        </div>

        {/* Right: Editorial News Briefings List */}
        <div className="min-w-0 lg:col-span-5 bg-[#111827] border border-gray-800 rounded-lg p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
            <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
              Editorial News Briefings ({items.length})
            </h2>
          </div>

          {loading && items.length === 0 ? (
            <p className="text-xs text-gray-400">Loading briefings...</p>
          ) : items.length === 0 ? (
            <p className="text-xs text-gray-500">No news briefings created yet.</p>
          ) : (
            <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
              {items.map((news) => {
                const isSelected = Boolean(editingNews?._id && editingNews._id === news._id);
                const href = `/news/${news.slug || news._id}`;

                return (
                  <div
                    key={news._id || news.slug}
                    className={`rounded-lg p-3.5 border transition-colors flex items-start justify-between gap-3 min-w-0 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60'
                        : 'bg-black/50 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase">
                        <span className="text-amber-400 font-bold">
                          {news.category || 'Defense'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            news.isPublished !== false
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-gray-700/50 text-gray-400'
                          }`}
                        >
                          {news.isPublished !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {news.title}
                      </h3>

                      <p className="text-[10px] text-gray-400 truncate">
                        {news.author || 'BattleTheory Editorial'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(news)}
                        title="Edit briefing"
                        className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-[10px] font-bold uppercase inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <Link
                        href={href}
                        target="_blank"
                        title="View briefing"
                        className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => handleDeleteClick(news)}
                        title="Delete briefing"
                        className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}