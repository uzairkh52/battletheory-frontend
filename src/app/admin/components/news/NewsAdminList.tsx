'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsList, deleteNews } from '@/store/slices/newsSlice';
import { Trash2, ExternalLink } from 'lucide-react';

export default function NewsAdminList() {
  const dispatch = useAppDispatch();
  const { items: newsList, loading } = useAppSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchNewsList());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      await dispatch(deleteNews(id));
    }
  };

  if (loading) {
    return <div className="text-amber-500 font-mono text-xs py-4">Loading news records...</div>;
  }

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 font-mono text-white">
      <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
        Active Defense News Items
      </h3>

      <div className="space-y-3">
        {newsList.length === 0 ? (
          <p className="text-xs text-gray-500">No news records found.</p>
        ) : (
          newsList.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-black/40 border border-gray-800 p-3 rounded"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-amber-500 font-bold uppercase">{item.category}</span>
                  <span className="text-gray-500">| Source: {item.source}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-200">{item.title}</h4>
              </div>

              <div className="flex items-center gap-3">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => item._id && handleDelete(item._id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
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