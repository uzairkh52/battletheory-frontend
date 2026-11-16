'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Radio, ExternalLink, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { useGetNewsQuery } from '@/store/api/newsApi';

const PAGE_SIZE = 20;

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
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
};

const getImage = (item: any): string =>
  [item?.image, item?.imageUrl, item?.thumbnail].find(
    (v) => typeof v === 'string' && v.trim() !== ''
  ) || '';

function NewsThumb({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <div className="order-2 sm:order-1 relative shrink-0 w-24 h-24 sm:w-36 sm:h-28 rounded-md overflow-hidden bg-gray-900 border border-gray-800">
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
    </div>
  );
}

function NewsCard({ item, priority }: { item: any; priority: boolean }) {
  const externalUrl: string | undefined = item.sourceUrl || item.link;
  const href = `/news/${item.slug || slugify(item.title) || item._id}`;
  const date = formatDate(item.publishedAt || item.pubDate || item.createdAt);
  const authorOrSource = item.author || item.source || 'BattleTheory Editorial';
  const summary = stripHtml(item.summary);

  return (
    <article className="group relative flex gap-4 bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-lg p-4 transition-colors [content-visibility:auto] [contain-intrinsic-size:auto_150px]">
      <NewsThumb src={getImage(item)} alt={item.title || 'Briefing thumbnail'} priority={priority} />

      <div className="order-1 sm:order-2 flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] uppercase tracking-wider">
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
            {item.category || 'Defense'}
          </span>
          <span className="text-gray-400 truncate max-w-[12rem]">{authorOrSource}</span>
          {date && <span className="text-gray-600">· {date}</span>}
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
              aria-label={`Open reference: ${authorOrSource}`}
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
        <div key={i} className="flex gap-4 bg-[#111827] border border-gray-800 rounded-lg p-4 animate-pulse">
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

export default function NewsFeedClient({
  initialNews = [],
  initialHasMore = false,
  initialFailed = false,
}: {
  initialNews?: any[];
  initialHasMore?: boolean;
  initialFailed?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [allNews, setAllNews] = useState<any[]>(initialNews);
  const [category, setCategory] = useState('all');

  const { data, isLoading, isFetching, error, refetch } = useGetNewsQuery({
    page,
    limit: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data?.news) return;
    setAllNews((prev) => {
      if (page === 1) return data.news;
      const ids = new Set(prev.map((n) => n._id));
      return [...prev, ...data.news.filter((n) => !ids.has(n._id))];
    });
  }, [data, page]);

  const news = data?.news ? allNews : initialNews;
  const hasMore = data ? Boolean(data.hasMore) : initialHasMore;
  const loading = (isLoading && news.length === 0) || (initialFailed && !data && !error);
  const errorMessage = error
    ? ('data' in error ? (error.data as any)?.message : (error as any)?.message) ||
      'Network connection failure'
    : null;

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    news.forEach((n) => {
      const c = typeof n.category === 'string' ? n.category.trim() : '';
      if (c) counts.set(c, (counts.get(c) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([c]) => c);
  }, [news]);

  const filtered = useMemo(
    () => (category === 'all' ? news : news.filter((n) => n.category === category)),
    [news, category]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 font-mono text-white">
      <header className="relative border border-amber-500/20 bg-black/40 rounded-lg p-5 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
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
            Original editorial analysis covering naval strategy, air defense, and military technology.
            {news.length > 0 && ` ${news.length} briefings loaded.`}
          </p>
        </div>
      </header>

      {categories.length > 1 && (
        <div
          className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter by category"
        >
          {['all', ...categories].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] uppercase tracking-wider font-bold border transition-colors ${
                category === c
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'border-gray-700 text-gray-400 hover:border-amber-500/50 hover:text-amber-500'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : news.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-gray-800 rounded-lg space-y-4">
          <p className="text-xs text-gray-500 uppercase">
            {errorMessage ? `Alert: ${errorMessage}` : 'No active defense intelligence briefings at this moment.'}
          </p>
          {errorMessage && (
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black px-4 py-2 rounded text-xs uppercase font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((item, i) => (
            <NewsCard key={item._id || item.slug || item.title} item={item} priority={i < 2} />
          ))}
        </div>
      )}

      {errorMessage && news.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-xs">
          <span>Alert: {errorMessage}</span>
          <button type="button" onClick={() => refetch()} className="font-bold uppercase underline shrink-0">
            Retry
          </button>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center pt-2 pb-4">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs uppercase tracking-widest rounded-md transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching...
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