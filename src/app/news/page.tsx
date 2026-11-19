'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  Radio,
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw,
  Newspaper,
} from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchNewsList, type NewsItem } from '@/store/slices/newsSlice';

const PAGE_SIZE = 20;

const stripHtml = (html?: string) =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const formatDate = (raw?: string) => {
  const d = raw ? new Date(raw) : null;
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const getImage = (item: NewsItem): string =>
  [item?.image, item?.imageUrl, item?.thumbnail].find(
    (v): v is string => typeof v === 'string' && v.trim() !== ''
  ) || '';

function FallbackIcon() {
  return <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500/80" />;
}

function NewsThumb({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showFallback = !src || failed;

  return (
    <div className="order-2 sm:order-1 relative shrink-0 w-24 h-24 sm:w-36 sm:h-28 rounded-md overflow-hidden bg-gradient-to-br from-gray-900 via-[#0d1320] to-black border border-gray-800 flex flex-col items-center justify-center gap-1.5">
      {showFallback ? (
        <>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <FallbackIcon />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
            No Thumb
          </span>
        </>
      ) : (
        <img
          src={src}
          alt={alt}
          width={144}
          height={112}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  );
}

function NewsCard({ item, priority }: { item: NewsItem; priority: boolean }) {
  const externalUrl = item.sourceUrl || item.link;
  const href = `/news/${item.slug || item._id}`;
  const date = formatDate(item.publishedAt || item.createdAt);
  const author = item.author || item.source || 'BattleTheory Editorial';
  const summary = stripHtml(item.summary);
  const alt = item.imageAlt || item.title || 'Briefing thumbnail';

  return (
    <article className="group relative flex gap-4 bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-lg p-4 transition-colors">
      <NewsThumb src={getImage(item)} alt={alt} priority={priority} />

      <div className="order-1 sm:order-2 flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] uppercase tracking-wider">
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
            {item.category || 'Defense'}
          </span>
          {item.isBreaking && (
            <span className="text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded font-bold">
              Breaking
            </span>
          )}
          <span className="text-gray-400 truncate max-w-[12rem]">{author}</span>
          {date && <span className="text-gray-600">· {date}</span>}
          {typeof item.readingTime === 'number' && item.readingTime > 0 && (
            <span className="text-gray-500">· {item.readingTime} min read</span>
          )}
        </div>

        <h2 className="font-sans text-[15px] sm:text-base font-bold text-white leading-snug line-clamp-3 sm:line-clamp-2 group-hover:text-amber-500 transition-colors">
          <Link href={href} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h2>

        {summary && (
          <p className="hidden sm:block font-sans text-xs text-gray-400 leading-relaxed line-clamp-2">
            {summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-amber-500">
            Read brief
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>

          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open reference: ${author}`}
              className="relative z-10 inline-flex items-center gap-1 text-[10px] uppercase text-gray-500 hover:text-amber-500 transition-colors py-1"
            >
              Reference <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 bg-[#111827] border border-gray-800 rounded-lg p-4 animate-pulse"
        >
          <div className="flex-1 space-y-3">
            <div className="h-3 w-1/2 bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-800 rounded" />
            <div className="h-4 w-3/4 bg-gray-800 rounded" />
          </div>
          <div className="w-24 h-24 sm:w-36 sm:h-28 bg-gray-800/60 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, currentPage, hasMore, totalNews, loading, error } = useSelector(
    (state: RootState) => state.news
  );
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchNewsList({ page: 1, limit: PAGE_SIZE, category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category?.trim()) set.add(item.category.trim());
    });
    return Array.from(set);
  }, [items]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    dispatch(
      fetchNewsList({
        page: currentPage + 1,
        limit: PAGE_SIZE,
        category: selectedCategory,
        append: true,
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 font-mono text-white">
      <header className="relative border border-amber-500/20 bg-black/40 rounded-lg p-5 sm:p-8 overflow-hidden">
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Defense &amp; Strategic Intelligence // Editorial Dispatch
          </div>
          <h1 className="flex items-start sm:items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight">
            <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 shrink-0 mt-1 sm:mt-0" />
            Defense &amp; Strategic Intelligence Briefings
          </h1>
          <p className="font-sans text-gray-400 text-sm max-w-2xl leading-relaxed">
            Original editorial analysis covering naval strategy, air defense, and military doctrine.
            {totalNews > 0 && ` ${totalNews} briefings available.`}
          </p>
        </div>
      </header>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] uppercase tracking-wider font-bold border transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'border-gray-700 text-gray-400 hover:border-amber-500/50 hover:text-amber-500'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {loading && items.length === 0 ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-gray-800 rounded-lg space-y-4">
          <p className="text-xs text-gray-500 uppercase">
            {error ? `Error: ${error}` : 'No published defense briefings available.'}
          </p>
          <button
            type="button"
            onClick={() =>
              dispatch(fetchNewsList({ page: 1, limit: PAGE_SIZE, category: selectedCategory }))
            }
            className="inline-flex items-center gap-2 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black px-4 py-2 rounded text-xs uppercase font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <NewsCard key={item._id || item.slug} item={item} priority={idx < 2} />
          ))}
        </div>
      )}

      {error && items.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-xs">
          <span>{error}</span>
          <button type="button" onClick={handleLoadMore} className="font-bold uppercase underline">
            Retry
          </button>
        </div>
      )}

      {hasMore && (
        <div className="text-center pt-2 pb-4">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more briefings'
            )}
          </button>
        </div>
      )}
    </div>
  );
}