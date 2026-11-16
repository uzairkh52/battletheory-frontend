'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsList, deleteNews } from '@/store/slices/newsSlice';
import { Trash2, Eye } from 'lucide-react';

export default function NewsAdminList() {
  const dispatch = useAppDispatch();
  const { items: newsList, loading, deleting } = useAppSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchNewsList({ page: 1, limit: 50, all: true }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news briefing?')) {
      await dispatch(deleteNews(id));
    }
  };

  if (loading && newsList.length === 0) {
    return <div className="text-amber-500 font-mono text-xs py-4">Loading news records...</div>;
  }

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 font-mono text-white">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider">
          Editorial News Briefings ({newsList.length})
        </h3>
      </div>

      <div className="space-y-3">
        {newsList.length === 0 ? (
          <p className="text-xs text-gray-500">No news records found.</p>
        ) : (
          newsList.map((item) => (
            <div
              key={item._id || item.slug}
              className="flex justify-between items-center gap-3 bg-black/40 border border-gray-800 p-3 rounded"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-amber-500 font-bold uppercase">{item.category}</span>
                  <span className="text-gray-500">· {item.author || 'BattleTheory Editorial'}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                      item.isPublished !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {item.isPublished !== false ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-200 truncate">{item.title}</h4>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.slug && (
                  <Link
                    href={`/news/${item.slug}`}
                    target="_blank"
                    title="View briefing"
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => item._id && handleDelete(item._id)}
                  title="Delete briefing"
                  className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}