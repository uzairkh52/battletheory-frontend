'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Radio, ExternalLink, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

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

// Fixed locale + UTC => server/client same output (hydration safe)
const formatDate = (raw?: string) => {
  const d = raw ? new Date(raw) : null;
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
};

const getApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'https://api.battletheory.net';
  return `${raw.replace(/\/+$/, '').replace(/\/api$/, '')}/api`;
};

async function fetchPage(page: number): Promise<{ items: any[]; more: boolean }> {
  const res = await fetch(`${getApiUrl()}/news?page=${page}&limit=${PAGE_SIZE}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  const items = Array.isArray(data) ? data : data.news || data.items || [];
  const more = !Array.isArray(data) && data.hasMore !== undefined ? Boolean(data.hasMore) : items.length === PAGE_SIZE;
  return { items, more };
}

const getImage = (item: any): string =>
  [item?.imageUrl, item?.image, item?.thumbnail].find(
    (v) => typeof v === 'string' && v.trim() !== ''
  ) || '';

/* ---------- Image: broken / missing ho to card text-only ban jata hai (khali box nahi) ---------- */

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
  const externalUrl: string | undefined = item.link || item.sourceUrl;
  const href = `/news/${slugify(item.title) || item._id}`;
  const date = formatDate(item.publishedAt || item.pubDate || item.createdAt);
  const source = item.source || 'Defense News';
  const summary = stripHtml(item.summary);

  return (
    <article
      // Off-screen cards ka rendering skip: lambi list par scroll/paint fast
      className="group relative flex gap-4 bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-lg p-4 transition-colors [content-visibility:auto] [contain-intrinsic-size:auto_150px]"
    >
      <NewsThumb src={getImage(item)} alt={item.title || 'News thumbnail'} priority={priority} />

      <div className="order-1 sm:order-2 flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] uppercase tracking-wider">
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
            {item.category || 'Defense'}
          </span>
          <span className="text-gray-400 truncate max-w-[10rem]">{source}</span>
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
              aria-label={`Open original source: ${source}`}
              className="relative z-10 inline-flex items-center gap-1 text-[10px] uppercase text-gray-500 hover:text-amber-500 transition-colors py-1"
            >
              Source <ExternalLink className="w-3 h-3" />
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

/* ---------- Page ---------- */

export default function NewsFeedClient({
  initialNews,
  initialHasMore,
  initialFailed,
}: {
  initialNews: any[];
  initialHasMore: boolean;
  initialFailed: boolean;
}) {
  const [news, setNews] = useState<any[]>(initialNews);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(initialFailed);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const pageRef = useRef(1); // sirf success par aage barhta hai

  const merge = (prev: any[], incoming: any[]) => {
    const ids = new Set(prev.map((n) => n._id));
    return [...prev, ...incoming.filter((n) => !ids.has(n._id))];
  };

  // Server fetch fail hui ho to client par dobara try
  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { items, more } = await fetchPage(1);
      setNews(items);
      setHasMore(more);
      pageRef.current = 1;
    } catch (e: any) {
      setError(e.message || 'Network connection failure');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFailed) loadInitial();
  }, [initialFailed, loadInitial]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const next = pageRef.current + 1;
    try {
      setLoadingMore(true);
      setError(null);
      const { items, more } = await fetchPage(next);
      setNews((prev) => merge(prev, items));
      setHasMore(more);
      pageRef.current = next;
    } catch (e: any) {
      setError(e.message || 'Failed to load more feeds');
    } finally {
      setLoadingMore(false);
    }
  };

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
      {/* Header */}
      <header className="relative border border-amber-500/20 bg-black/40 rounded-lg p-5 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Defense &amp; Strategic Intelligence // Live feed
          </div>
          <h1 className="flex items-start sm:items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wide leading-tight">
            <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 shrink-0 mt-1 sm:mt-0" />
            Defense &amp; Strategic Intelligence Alerts
          </h1>
          <p className="font-sans text-gray-400 text-sm max-w-2xl leading-relaxed">
            Automated tracking of autonomous systems, military AI and next-gen defense tech.
            {news.length > 0 && ` ${news.length} dispatches loaded.`}
          </p>
        </div>
      </header>

      {/* Category filter: mobile par horizontal scroll */}
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

      {/* List */}
      {loading ? (
        <Skeleton />
      ) : news.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-gray-800 rounded-lg space-y-4">
          <p className="text-xs text-gray-500 uppercase">
            {error ? `Alert: ${error}` : 'No active defense intelligence alerts at this moment.'}
          </p>
          {error && (
            <button
              type="button"
              onClick={loadInitial}
              className="inline-flex items-center gap-2 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black px-4 py-2 rounded text-xs uppercase font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((item, i) => (
            <NewsCard key={item._id || item.title} item={item} priority={i < 2} />
          ))}
        </div>
      )}

      {/* Load more error (list wahi rehti hai) */}
      {error && news.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-xs">
          <span>Alert: {error}</span>
          <button type="button" onClick={loadMore} className="font-bold uppercase underline shrink-0">
            Retry
          </button>
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="text-center pt-2 pb-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs uppercase tracking-widest rounded-md transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Load more feeds'
            )}
          </button>
          {category !== 'all' && (
            <p className="mt-3 text-[11px] text-gray-600">
              Filter sirf load ho chuki dispatches par chalta hai.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
