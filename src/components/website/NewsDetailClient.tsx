'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsBySlug } from '@/store/slices/newsSlice';
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  Calendar,
} from 'lucide-react';

export default function NewsDetailClient({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { selectedNews, loading, error } = useAppSelector(
    (state) => state.news,
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchNewsBySlug(slug));
    }
  }, [dispatch, slug]);

  // ⚡ Instant Browser Tab Title Update
  useEffect(() => {
    if (selectedNews?.title) {
      document.title = `${selectedNews.title} | Battle Theory`;
    }
  }, [selectedNews]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center font-mono text-amber-500 animate-pulse text-sm tracking-widest">
        [ DECRYPTING INTELLIGENCE BRIEFING... ]
      </div>
    );
  }

  if (error || !selectedNews) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center font-mono text-red-500 space-y-4">
        <p className="text-sm">Intelligence briefing record not found.</p>
        <Link
          href="/news"
          className="text-amber-500 hover:underline text-xs uppercase font-bold"
        >
          ← Back to Defense Feeds
        </Link>
      </div>
    );
  }

  const imageUrl = selectedNews.image || selectedNews.imageUrl || selectedNews.thumbnail;

  return (
    <article className="max-w-4xl mx-auto p-6 font-mono space-y-6 text-white overflow-hidden">
      {/* Directive Badge */}
      <div className="flex items-center gap-2 text-amber-500">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          LIVE INTEL FEED // DIRECTIVE 03
        </span>
      </div>

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
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Source: {selectedNews.source || 'Defense News'}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight uppercase tracking-wider">
          {selectedNews.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Logged:{' '}
            {selectedNews.createdAt ? new Date(selectedNews.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Featured Image Banner */}
      {imageUrl && (
        <div className="w-full h-[280px] md:h-[350px] rounded-lg overflow-hidden bg-black flex items-center justify-center border border-amber-500/20 shadow-lg relative">
          <img
            src={imageUrl}
            alt={selectedNews.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Executive Summary */}
      {selectedNews.summary && (
        <div className="bg-amber-500/5 border-l-4 border-amber-500 p-4 rounded-r-lg space-y-2">
          <div className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
            Executive Summary
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans">
            {selectedNews.summary}
          </p>
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-4 font-sans"
        dangerouslySetInnerHTML={{ 
          __html: selectedNews.content ? selectedNews.content.replace(/<img[^>]*>/gi, '') : '' 
        }}
      />

      {/* External Source Link */}
      {selectedNews.link && (
        <div className="pt-6 border-t border-gray-800 flex justify-end">
          <a
            href={selectedNews.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded transition-colors"
          >
            <span>View Original Briefing</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </article>
  );
}