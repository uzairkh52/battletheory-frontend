'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// FIXED: fetchArticles ko replace karke fetchAllArticles import karein
import { fetchAllArticles } from '@/store/slices/articleSlice';

export default function ArticlesListPage() {
  const dispatch = useAppDispatch();
  const { articles = [], loading, error } = useAppSelector((state) => state.articles);

  useEffect(() => {
    // FIXED: fetchAllArticles dispatch karein
    dispatch(fetchAllArticles());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
          DECLASSIFIED INTELLIGENCE
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
          Tactical Articles Archive
        </h1>
      </div>

      {loading ? (
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ DECRYPTING ARCHIVE INDEX... ]
        </p>
      ) : error ? (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 text-xs font-mono rounded">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-gray-800 rounded">
          <p className="text-xs font-mono text-gray-500 uppercase">
            No intelligence articles found in database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div
              key={art._id}
              className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 transition-colors p-6 rounded-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                  LOG: {new Date(art.createdAt).toLocaleDateString()}
                </span>
                <h2 className="text-xl font-bold text-white uppercase">
                  {art.title}
                </h2>
                <p className="text-xs font-mono text-gray-400 line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <Link
                href={`/articles/${art.slug}`}
                className="inline-block text-center py-2 px-4 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                Read Full Briefing →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}