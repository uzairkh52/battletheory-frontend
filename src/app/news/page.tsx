'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsList } from '@/store/slices/newsSlice';
import { Radio, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';

// Title ko clean hyphenated slug mein convert karne ke liye helper function
const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { items: newsList, loading, error } = useAppSelector((state: any) => state.news);

  useEffect(() => {
    dispatch(fetchNewsList());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-amber-500 font-mono space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm tracking-wider uppercase">MONITORING DEFENSE INTELLIGENCE FEEDS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-mono text-white">
      {/* Header Banner */}
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-black uppercase text-amber-500 tracking-wider flex items-center gap-3">
          <Radio className="w-8 h-8 text-amber-500 animate-pulse" />
          AI & Modern Defense News
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Automated intelligence tracking autonomous systems, military AI integration, and next-gen defense tech.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-xs">
          {error}
        </div>
      )}

      {/* News Feeds Container */}
      <div className="space-y-4">
        {newsList.length === 0 ? (
          <p className="text-gray-500 text-sm">No active defense intelligence alerts at this moment.</p>
        ) : (
          newsList.map((item: any) => {
            const externalUrl = item.link || item.sourceUrl;
            const targetSlug = slugify(item.title) || item._id;
            const imageUrl = item.imageUrl || item.image || item.thumbnail;

            return (
              <div
                key={item._id}
                className="bg-[#111827] border border-gray-800 hover:border-amber-500/40 p-4 sm:p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all group"
              >
                {/* Left Side: Featured Image using standard img tag */}
                <div className="w-full md:w-48 h-32 relative rounded overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title || 'News thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-[#0b0f19]">
                      <Radio className="w-6 h-6 mb-1 text-gray-700" />
                      <span className="text-[9px] uppercase tracking-widest">NO VISUAL</span>
                    </div>
                  )}
                </div>

                {/* Middle: Title, Category & Summary */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold text-[10px]">
                      {item.category || 'MILITARY AI & DEFENSE'}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Source: <strong className="text-gray-300">{item.source || 'Defense News'}</strong>
                    </span>
                  </div>

                  {/* Title mapped with Dynamic Hyphenated Slug Link */}
                  <Link href={`/news/${targetSlug}`} className="inline-block">
                    <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-500 transition-colors flex items-center gap-2">
                      <span className="line-clamp-2">{item.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500 shrink-0" />
                    </h2>
                  </Link>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.summary}</p>
                </div>

                {/* Right Side: External Source Link */}
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded text-xs font-bold uppercase transition-colors whitespace-nowrap self-stretch md:self-center"
                  >
                    <span>Source Brief</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}