'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { performGlobalSearch } from '@/store/slices/searchSlice';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const dispatch = useAppDispatch();
  
  const { battles, articles, defenseNews, loading, error } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (query) {
      dispatch(performGlobalSearch(query));
    }
  }, [query, dispatch]);

  const totalResults = battles.length + articles.length + defenseNews.length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto space-y-6 pt-16">
        <div>
          <h1 className="text-xl font-black text-amber-500 uppercase tracking-wider">
            INTELLIGENCE SEARCH RESULTS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Query: <span className="text-white font-bold">&quot;{query}&quot;</span> — Found {totalResults} tactical records.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-amber-500 animate-pulse text-xs">
            [ SCANNING DATABASE & ARCHIVES... ]
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded text-red-400 text-xs">
            Error: {error}
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-[#111827] border border-gray-800 p-8 rounded text-center text-gray-400 text-xs">
            No intelligence records found matching your query.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Battles Results */}
            {battles.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-1">
                  Battles & Engagements ({battles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {battles.map((battle: any) => {
                    const thumbnail = battle.featuredImage || battle.thumbnail || 'https://images.unsplash.com/photo-1579965101323-8832a84a6b57?w=600&auto=format&fit=crop&q=60';
                    return (
                      <Link
                        key={battle._id}
                        href={`/battles/${battle.slug || battle._id}`}
                        className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded overflow-hidden flex gap-4 transition group"
                      >
                        <div className="w-28 h-28 bg-black/40 flex-shrink-0 overflow-hidden border-r border-gray-800">
                          <img src={thumbnail} alt={battle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold uppercase">
                                {battle.theater || 'THEATER'}
                              </span>
                              <span className="text-gray-400 font-bold">{battle.year || 'N/A'}</span>
                            </div>
                            <h3 className="text-xs font-bold mt-1.5 text-white group-hover:text-amber-500 transition-colors uppercase truncate">
                              {battle.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 font-sans">
                              {battle.summary || battle.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Articles Results */}
            {articles.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-1">
                  Field Reports & Articles ({articles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article: any) => {
                    const thumbnail = article.featuredImage || article.thumbnail || 'https://images.unsplash.com/photo-1579965101323-8832a84a6b57?w=600&auto=format&fit=crop&q=60';
                    return (
                      <Link
                        key={article._id}
                        href={`/articles/${article.slug || article._id}`}
                        className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded overflow-hidden flex gap-4 transition group"
                      >
                        <div className="w-28 h-28 bg-black/40 flex-shrink-0 overflow-hidden border-r border-gray-800">
                          <img src={thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors uppercase truncate">
                              {article.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 font-sans">
                              {article.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Defense News Results */}
            {defenseNews.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-1">
                  Defense Intelligence & News ({defenseNews.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defenseNews.map((news: any) => {
                    const targetSlug = news.title 
                      ? news.title.toString().toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') 
                      : news._id;
                    
                    const thumbnail = news.imageUrl || news.urlToImage || news.featuredImage || news.image || news.thumbnail;

                    return (
                      <Link
                        key={news._id}
                        href={`/news/${targetSlug}`}
                        className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded overflow-hidden flex gap-4 p-3 transition group"
                      >
                        <div className="w-24 h-24 bg-black/40 flex-shrink-0 overflow-hidden rounded border border-gray-800">
                          {thumbnail ? (
                            <img src={thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-600 uppercase">NO VISUAL</div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-[10px] text-amber-500 font-bold uppercase">{news.source || 'Defense News'}</span>
                            <h3 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors uppercase line-clamp-2 mt-0.5">{news.title}</h3>
                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 font-sans">{news.summary}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f19] text-amber-500 p-10 font-mono text-xs">[ INITIALIZING SEARCH MODULE... ]</div>}>
      <SearchContent />
    </Suspense>
  );
}