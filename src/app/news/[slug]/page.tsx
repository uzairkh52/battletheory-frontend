'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ExternalLink, ShieldAlert, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchNewsBySlug, setSelectedNews } from '@/store/slices/newsSlice';

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const dispatch = useDispatch<AppDispatch>();

  const { selectedNews, detailLoading, error } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    if (!slug) return;
    dispatch(fetchNewsBySlug(slug));
    return () => {
      dispatch(setSelectedNews(null));
    };
  }, [dispatch, slug]);

  if (detailLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center gap-3 font-mono text-xs text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        Loading briefing...
      </div>
    );
  }

  if (error || !selectedNews) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <p className="text-sm text-red-400">{error || 'Briefing not found.'}</p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs uppercase text-amber-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  const image = selectedNews.image || selectedNews.imageUrl || selectedNews.thumbnail;
  const imageAlt = selectedNews.imageAlt || selectedNews.title;
  const externalUrl = selectedNews.sourceUrl || selectedNews.link;
  const rawDate = selectedNews.publishedAt || selectedNews.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  return (
    <article className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6 text-white">
      <div>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-amber-500 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Briefings
        </Link>
      </div>

      <header className="space-y-4 border-b border-gray-800 pb-6">
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider">
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded font-bold">
            {selectedNews.category || 'Defense'}
          </span>
          {selectedNews.isBreaking && (
            <span className="text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 rounded font-bold">
              Breaking
            </span>
          )}
          <span className="text-gray-400">
            {selectedNews.author || selectedNews.source || 'BattleTheory Editorial'}
          </span>
          {formattedDate && <span className="text-gray-600">· {formattedDate}</span>}
          {typeof selectedNews.readingTime === 'number' && selectedNews.readingTime > 0 && (
            <span className="text-gray-500">· {selectedNews.readingTime} min read</span>
          )}
        </div>

        <h1 className="font-sans text-2xl sm:text-4xl font-black leading-tight">
          {selectedNews.title}
        </h1>

        {selectedNews.summary && (
          <p className="font-sans text-base text-gray-300 leading-relaxed">
            {selectedNews.summary}
          </p>
        )}
      </header>

      {image && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
          <img
            src={image}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Article Content */}
      <div
        className="prose prose-invert max-w-none font-sans text-gray-200 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: selectedNews.content }}
      />

      {/* Original Tactical Analysis Box */}
      {selectedNews.tacticalAnalysis && (
        <section className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            BattleTheory Tactical Assessment
          </div>
          <p className="font-sans text-sm text-gray-200 leading-relaxed">
            {selectedNews.tacticalAnalysis}
          </p>
        </section>
      )}

      {Array.isArray(selectedNews.tags) && selectedNews.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedNews.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 font-mono text-[11px] text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {externalUrl && (
        <div className="pt-4 border-t border-gray-800">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-amber-500 hover:underline"
          >
            View Reference Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}