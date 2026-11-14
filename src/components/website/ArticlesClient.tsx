'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Search, X, Clock, RefreshCw } from 'lucide-react';
import BookmarkButton from '@/components/website/BookmarkButton';
import { getApiBaseUrl } from '@/lib/api';

const PAGE_SIZE = 9;

const stripHtml = (html?: string) =>
  (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const getImage = (a: any): string =>
  [a?.featuredImage, a?.imageUrl, a?.image].find(
    (v) => typeof v === 'string' && v.trim() !== ''
  ) || '';

const getCategory = (a: any): string => {
  const c = typeof a?.category === 'object' && a.category ? a.category.name : a?.category;
  return typeof c === 'string' ? c.trim() : '';
};

// Fixed locale + UTC: server/client par same output (hydration safe), format: 12 Nov 2026
const formatDate = (d?: string) => {
  const date = d ? new Date(d) : null;
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const readingTime = (a: any): number | null => {
  const text = stripHtml(a?.content);
  if (!text) return null;
  return Math.max(1, Math.round(text.split(' ').length / 200));
};

function Thumb({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-[#0b0f19]">
        <Shield className="w-7 h-7 mb-1 text-gray-700" />
        <span className="text-[9px] uppercase tracking-widest">Tactical Log</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
    />
  );
}

function Meta({ art }: { art: any }) {
  const cat = getCategory(art);
  const rt = readingTime(art);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-wider">
      {cat && (
        <span className="text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded font-bold">
          {cat}
        </span>
      )}
      <span className="text-gray-500">{formatDate(art.createdAt)}</span>
      {rt && (
        <span className="text-gray-500 inline-flex items-center gap-1">
          <Clock className="w-3 h-3" /> {rt} min read
        </span>
      )}
    </div>
  );
}

function bookmarkProps(art: any) {
  const d = art.createdAt ? new Date(art.createdAt) : null;
  return {
    itemType: 'article' as const,
    itemId: art._id,
    title: art.title,
    slug: art.slug,
    thumbnail: getImage(art),
    year: d && !isNaN(d.getTime()) ? String(d.getUTCFullYear()) : '',
    summary: art.summary,
  };
}

function FeaturedCard({ art }: { art: any }) {
  const href = `/articles/${art.slug || art._id}`;
  return (
    <article className="group relative grid md:grid-cols-5 md:h-[260px] bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-colors">
      <div className="relative md:col-span-2 h-48 md:h-full bg-gray-900 overflow-hidden">
        <Thumb src={getImage(art)} alt={art.title || 'Article'} />
      </div>
      <div className="md:col-span-3 p-5 md:p-6 flex flex-col justify-center gap-2.5 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
          [ Latest Briefing ]
        </span>
        <Meta art={art} />
        <h2 className="text-lg md:text-xl font-black text-white leading-snug font-sans line-clamp-2 group-hover:text-amber-500 transition-colors">
          <Link href={href} className="after:absolute after:inset-0">
            {art.title}
          </Link>
        </h2>
        <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans line-clamp-2">
          {stripHtml(art.summary)}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-amber-500">
            Read briefing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="relative z-10">
            <BookmarkButton {...bookmarkProps(art)} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ art }: { art: any }) {
  const href = `/articles/${art.slug || art._id}`;
  return (
    <article className="group relative flex flex-col bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden border-b border-gray-800">
        <Thumb src={getImage(art)} alt={art.title || 'Article'} />
      </div>
      <div className="flex-1 flex flex-col p-5 gap-3">
        <Meta art={art} />
        <h2 className="text-base font-bold text-white leading-snug font-sans line-clamp-2 group-hover:text-amber-500 transition-colors">
          <Link href={href} className="after:absolute after:inset-0">
            {art.title}
          </Link>
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
          {stripHtml(art.summary)}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-800/70 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-amber-500">
            Read briefing <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="relative z-10">
            <BookmarkButton {...bookmarkProps(art)} />
          </div>
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-[16/10] bg-gray-800/60" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-1/3 bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-800 rounded" />
            <div className="h-4 w-2/3 bg-gray-800 rounded" />
            <div className="h-3 w-full bg-gray-800/70 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ArticlesClient({
  initialArticles,
  initialFailed,
}: {
  initialArticles: any[];
  initialFailed: boolean;
}) {
  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [loading, setLoading] = useState(initialFailed);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${getApiBaseUrl()}/articles`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : json?.articles || json?.data || [];
      setArticles(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Server fetch fail ho to client par dobara try
  useEffect(() => {
    if (initialFailed) load();
  }, [initialFailed, load]);

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ),
    [articles]
  );

  const categories = useMemo(
    () => Array.from(new Set(sorted.map(getCategory).filter(Boolean))),
    [sorted]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((a) => {
      if (category !== 'all' && getCategory(a) !== category) return false;
      if (!q) return true;
      return (
        (a.title || '').toLowerCase().includes(q) ||
        stripHtml(a.summary).toLowerCase().includes(q)
      );
    });
  }, [sorted, query, category]);

  const showFeatured = !query.trim() && category === 'all' && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;
  const shown = rest.slice(0, visible);

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-8 font-mono text-white">
      {/* Header */}
      <header className="border-b border-gray-800 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-2">
          <span className="text-[10px] text-amber-500 uppercase tracking-widest block">
            Declassified Intelligence
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
            Tactical Articles Archive
          </h1>
          <p className="text-xs text-gray-500 font-sans max-w-xl">
            In-depth briefings on battles, commanders, weapons and doctrine.
            {articles.length > 0 && ` ${articles.length} reports and counting.`}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full bg-black/40 border border-gray-700 rounded-lg pl-9 pr-9 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Category chips */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setVisible(PAGE_SIZE);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold border transition-colors ${
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

      {/* Content */}
      {loading ? (
        <Skeleton />
      ) : error ? (
        <div className="p-8 text-center border border-red-800/40 bg-red-950/20 rounded-xl space-y-4">
          <p className="text-xs text-red-400 uppercase">Error: {error}</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 border border-red-700/50 text-red-300 hover:bg-red-900/30 px-4 py-2 rounded text-xs uppercase font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-gray-800 rounded-xl">
          <p className="text-xs text-gray-500 uppercase">No intelligence articles published yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-gray-800 rounded-xl space-y-4">
          <p className="text-xs text-gray-500 uppercase">No articles match your search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="text-xs font-bold text-amber-500 hover:underline uppercase"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {featured && <FeaturedCard art={featured} />}

          {shown.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.map((art) => (
                <ArticleCard key={art._id || art.slug} art={art} />
              ))}
            </div>
          )}

          {rest.length > visible && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                Showing {shown.length + (featured ? 1 : 0)} of {filtered.length}
              </p>
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="border border-gray-700 bg-gray-800/50 hover:border-amber-500/50 hover:text-amber-500 text-gray-200 px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all"
              >
                Load more briefings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}