'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticleBySlug } from '@/store/slices/articleSlice';
import CommentSection from '@/components/CommentSection';

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams?.slug;

  const dispatch = useAppDispatch();
  const { article, loading, submittingComment, error } = useAppSelector(
    (state) => state.articles
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleBySlug(slug));
    }
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ DECRYPTING FIELD INTELLIGENCE BRIEFING... ]
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-[#111827] border border-red-900/50 rounded-lg text-center space-y-4">
        <h2 className="text-xl font-black text-red-400 uppercase tracking-wider">
          CLASSIFIED RECORD NOT FOUND
        </h2>
        <p className="text-xs font-mono text-gray-400">
          {error || 'The requested tactical article dossier does not exist or has been redacted.'}
        </p>
        <Link
          href="/articles"
          className="inline-block px-4 py-2 bg-amber-600 text-black text-xs font-bold uppercase rounded hover:bg-amber-500 transition-colors"
        >
          Return to Archives
        </Link>
      </div>
    );
  }

  // 🌟 Article image check karne ke liye variable
  const imageUrl = article.featuredImage || article.imageUrl || article.image;

  return (
    <article className="max-w-4xl mx-auto my-8 space-y-8 px-4 font-mono">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/articles" className="hover:text-amber-500 transition-colors">
          ARCHIVES
        </Link>
        <span>/</span>
        <span className="text-amber-500 uppercase">{article.slug}</span>
      </div>

      {/* Header */}
      <header className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
            TACTICAL ANALYSIS
          </span>
          <span className="text-xs text-gray-500">
            LOG DATE:{' '}
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
          {article.title}
        </h1>
        <p className="text-sm text-gray-400 border-l-2 border-amber-500 pl-4 py-1 italic bg-[#0b0f19]">
          "{article.summary}"
        </p>
      </header>

      {/* 🌟 Featured Image Display Container */}
      {imageUrl && (
        <div className="w-full h-72 md:h-96 relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Body */}
      <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
        <h3 className="text-xs text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          DECLASSIFIED BRIEFING BODY
        </h3>
        <div className="prose prose-invert max-w-none text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
          {article.content}
        </div>
      </div>

      {/* Modular Comments Section Component */}
      <CommentSection 
        slug={article.slug} 
        comments={article.comments || []} 
        submittingComment={submittingComment} 
        type="article" 
      />
    </article>
  );
}