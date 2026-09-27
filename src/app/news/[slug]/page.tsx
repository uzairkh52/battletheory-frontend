'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsBySlug } from '@/store/slices/newsSlice';
import { ArrowLeft, ExternalLink, Shield, Calendar } from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { selectedNews, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (slug) {
      dispatch(fetchNewsBySlug(slug));
    }
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center font-mono text-amber-500 animate-pulse text-sm tracking-widest">
        DECRYPTING INTELLIGENCE BRIEFING...
      </div>
    );
  }

  if (error || !selectedNews) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center font-mono text-red-500 space-y-4">
        <p className="text-sm">Intelligence briefing record not found.</p>
        <Link href="/news" className="text-amber-500 hover:underline text-xs uppercase font-bold">
          ← Back to Defense Feeds
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6 font-mono space-y-6 text-white">
      {/* Navigation */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Back to Defense Feeds</span>
      </Link>

      {/* Main Header */}
      <div className="space-y-4 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-bold uppercase">
            {selectedNews.category || 'MILITARY AI & DEFENSE'}
          </span>
          <span className="text-gray-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Source: <strong className="text-gray-200">{selectedNews.source}</strong>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-amber-500 uppercase tracking-wide leading-tight">
          {selectedNews.title}
        </h1>

        {selectedNews.createdAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Logged: {new Date(selectedNews.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <div className="bg-[#111827] border-l-4 border-amber-500 p-4 rounded-r space-y-1">
        <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block">
          EXECUTIVE SUMMARY
        </span>
        <p className="text-xs text-gray-300 leading-relaxed font-semibold">
          {selectedNews.summary}
        </p>
      </div>

      {/* Full Article Content */}
      <div className="text-sm text-gray-300 leading-relaxed space-y-4 pt-2">
        {selectedNews.content ? (
          <p>{selectedNews.content}</p>
        ) : (
          <p className="italic text-gray-500 text-xs">
            Full intelligence text aggregated directly from source stream. Refer to official release via external link below.
          </p>
        )}
      </div>

      {/* External Original Link */}
      {(selectedNews.link || selectedNews.sourceUrl) && (
        <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
          <span className="text-xs text-gray-500">Verified Wire Transmission</span>
          <a
            href={selectedNews.link || selectedNews.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded text-xs font-bold uppercase transition-colors"
          >
            <span>Open Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}