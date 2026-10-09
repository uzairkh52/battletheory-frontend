'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllArticles } from '@/store/slices/articleSlice';
import BookmarkButton from '@/components/website/BookmarkButton';
import { Shield, ChevronRight } from 'lucide-react';

export default function ArticlesListPage() {
  const dispatch = useAppDispatch();
  const { articles = [], loading, error } = useAppSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-6 font-mono text-white">
      <div className="border-b border-gray-800 pb-4">
        <span className="text-[10px] text-amber-500 uppercase tracking-widest block">
          DECLASSIFIED INTELLIGENCE
        </span>
        <h1 className="text-3xl font-black uppercase tracking-wider text-white">
          Tactical Articles Archive
        </h1>
      </div>

      {loading ? (
        <p className="text-xs text-amber-500 animate-pulse">
          [ DECRYPTING ARCHIVE INDEX... ]
        </p>
      ) : error ? (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-gray-800 rounded">
          <p className="text-xs text-gray-500 uppercase">
            No intelligence articles found in database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles.map((art: any) => {
            const imageUrl = art.featuredImage || art.imageUrl || art.image;

            return (
              <div
                key={art._id}
                className="bg-[#111827] border border-gray-800 hover:border-amber-500/40 p-4 sm:p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all group relative"
              >
                {/* Left Side: Feature Image / Placeholder */}
                <div className="w-full md:w-48 h-32 relative rounded overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={art.title || 'Article thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-[#0b0f19]">
                      <Shield className="w-6 h-6 mb-1 text-gray-700" />
                      <span className="text-[9px] uppercase tracking-widest">TACTICAL LOG</span>
                    </div>
                  )}
                </div>

                {/* Middle: Date, Title, & Summary */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 uppercase font-bold text-[10px]">
                      LOG: {new Date(art.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/articles/${art.slug}`} className="inline-block">
                    <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-500 transition-colors flex items-center gap-2">
                      <span className="line-clamp-1">{art.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500 shrink-0" />
                    </h2>
                  </Link>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Right Side: Actions (Read Briefing + Bookmark Button) */}
                <div className="flex items-center gap-2 self-stretch md:self-center">
                  <Link
                    href={`/articles/${art.slug}`}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded text-xs font-bold uppercase transition-colors whitespace-nowrap"
                  >
                    <span>Read Briefing</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* 🌟 2. Integrated Bookmark Button */}
                  <BookmarkButton
                    itemType="article"
                    itemId={art._id}
                    title={art.title}
                    slug={art.slug}
                    thumbnail={imageUrl}
                    year={new Date(art.createdAt || Date.now()).getFullYear().toString()}
                    summary={art.summary}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}