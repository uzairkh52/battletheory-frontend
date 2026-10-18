'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Radio, ExternalLink, RefreshCw, ChevronRight, Loader2 } from 'lucide-react';

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

export default function NewsFeedClient() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchNews = async (pageNumber: number, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`${API_URL}/news?page=${pageNumber}&limit=20`, {
        cache: 'no-store', // Cache bypass for fresh paginated results
      });
      const data = await res.json();

      if (res.ok) {
        const fetchedNews = Array.isArray(data) ? data : data.news || [];
        const moreAvailable = data.hasMore !== undefined ? data.hasMore : fetchedNews.length === 20;

        if (isInitial) {
          setNewsList(fetchedNews);
        } else {
          // Unique items append ensure karein taake duplicate IDs react render crash na karein
          setNewsList((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const uniqueNewNews = fetchedNews.filter((item: any) => !existingIds.has(item._id));
            return [...prev, ...uniqueNewNews];
          });
        }

        setHasMore(moreAvailable);
      } else {
        setError(data.message || 'Failed to load intelligence feeds');
      }
    } catch (err: any) {
      setError(err.message || 'Network connection failure');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-amber-500 font-mono space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm tracking-wider uppercase">[ MONITORING DEFENSE INTELLIGENCE FEEDS... ]</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-mono text-white">
      {/* Header Banner */}
      <div className="relative border border-amber-500/20 bg-black/40 rounded-lg p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              DEFENSE & STRATEGIC INTELLIGENCE // LIVE FEED
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-wider flex items-center gap-3">
              <Radio className="w-8 h-8 text-amber-500 animate-pulse" />
              Defense & Strategic Intelligence Alerts
            </h1>

            <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              Automated intelligence tracking autonomous systems, military AI integration, and next-gen defense tech. Showing {newsList.length} active feeds.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-xs font-mono">
          [ ALERT ERROR: {error} ]
        </div>
      )}

      {/* News Feeds List */}
      <div className="space-y-4">
        {newsList.length === 0 ? (
          <p className="text-gray-500 text-sm">No active defense intelligence alerts at this moment.</p>
        ) : (
          newsList.map((item: any, index: number) => {
            const externalUrl = item.link || item.sourceUrl;
            const targetSlug = slugify(item.title) || item._id;
            const imageUrl = item.imageUrl || item.image || item.thumbnail;

            return (
              <div
                key={`${item._id}-${index}`}
                className="bg-[#111827] border border-gray-800 hover:border-amber-500/40 p-4 sm:p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all group"
              >
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

                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold text-[10px]">
                      {item.category || 'MILITARY AI & DEFENSE'}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Source: <strong className="text-gray-300">{item.source || 'Defense News'}</strong>
                    </span>
                  </div>

                  <Link href={`/news/${targetSlug}`} className="inline-block">
                    <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-500 transition-colors flex items-center gap-2">
                      <span className="line-clamp-2">{item.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500 shrink-0" />
                    </h2>
                  </Link>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.summary}</p>
                </div>

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

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6 pb-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/5"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>[ FETCHING ADDITIONAL INTELLIGENCE... ]</span>
              </>
            ) : (
              <span>[ LOAD MORE INTELLIGENCE FEEDS ]</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}