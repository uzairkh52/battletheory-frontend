'use client';

import styles from "@/styles/component/article/ArticleDetail.module.scss";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticleBySlug } from '@/store/slices/articleSlice';
import CommentSection from '@/components/CommentSection';
import { Edit3, ShieldAlert } from 'lucide-react';

export default function ArticleDetailClient({ slug, initialArticle }: { slug: string; initialArticle?: any }) {
  const dispatch = useAppDispatch();
  const { article: storeArticle, loading, submittingComment, error } = useAppSelector(
    (state) => state.articles
  );

  const article = storeArticle || initialArticle;

  const { user } = useAppSelector((state) => state.auth);
  // 🌟 Hydration mismatch fix karne ke liye state use ki hai
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(Boolean(user?.isAdmin || user?.role === 'admin'));
  }, [user]);

  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    if (slug && !initialArticle) {
      dispatch(fetchArticleBySlug(slug));
    }
  }, [slug, dispatch, initialArticle]);

  if (!article && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-mono">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ DECRYPTING FIELD INTELLIGENCE BRIEFING... ]
        </p>
      </div>
    );
  }

  if (!article && error) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-[#111827] border border-red-900/50 rounded-lg text-center space-y-4 font-mono">
        <h2 className="text-xl font-black text-red-400 uppercase tracking-wider">
          CLASSIFIED RECORD NOT FOUND
        </h2>
        <p className="text-xs text-gray-400">
          {error || 'The requested tactical article dossier does not exist or has been redacted.'}
        </p>
        <Link
          href="/articles"
          className="inline-block px-4 py-2 bg-amber-600 text-black text-xs font-bold uppercase rounded hover:bg-amber-500 transition-colors"
        >
          Return to Strategic Dossiers
        </Link>
      </div>
    );
  }

  if (!article) return null;

  const imageUrl = article.featuredImage || article.imageUrl || article.image;
  const articleId = article._id || article.id;

  return (
    <article className={`${styles.articleContainer} max-w-4xl mx-auto my-8 space-y-8 px-4 font-mono relative`}>
      
      {/* Back to Strategic Dossiers Button */}
      <div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider transition-colors"
        >
          <span>←</span> Back to Strategic Dossiers
        </Link>
      </div>

      {isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center justify-between shadow-lg backdrop-blur-sm sticky top-4 z-40">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>[ COMMANDER CLEARANCE: QUICK EDIT ACTIVE ]</span>
          </div>
          {articleId && (
            <Link
              href={`/admin/articles/edit/${articleId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Link href="/articles" className="hover:text-amber-500 transition-colors">
            DOSSIERS
          </Link>
          <span>/</span>
          <span className="text-amber-500 uppercase">{article.slug}</span>
        </div>

        {isAdmin && articleId && (
          <Link
            href={`/admin/articles/edit/${articleId}`}
            className="text-amber-500 hover:text-amber-400 text-[11px] font-bold uppercase underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Edit Intel
          </Link>
        )}
      </div>

      <header className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            STRATEGIC RESEARCH // DIRECTIVE 02
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold">
            TACTICAL ANALYSIS
          </span>
          <span className="text-xs text-gray-500">
            LOG DATE:{' '}
            {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-sm text-gray-400 border-l-2 border-amber-500 pl-4 py-1 italic bg-[#0b0f19]">
            &ldquo;{article.summary}&rdquo;
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">TAGS:</span>
              {article.tags.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-[10px] text-amber-500 hover:text-amber-400 uppercase font-bold transition-colors cursor-pointer"
                >
                  {showAllTags ? 'Show Less ▴' : `+${article.tags.length - 6} More ▾`}
                </button>
              )}
            </div>

            <div className={`flex flex-wrap items-center gap-2 overflow-hidden transition-all duration-300 ${
              showAllTags ? 'max-h-96' : 'max-h-[52px]'
            }`}>
              {article.tags.map((tag: string, idx: number) => (
                <Link
                  key={idx}
                  href={`/articles/tag/${encodeURIComponent(tag)}`}
                  className="bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 text-amber-400 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {imageUrl && (
        <div className="w-full h-72 md:h-96 relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 md:p-8 space-y-6 overflow-hidden">
        <h3 className="text-xs text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2 font-bold">
          DECLASSIFIED BRIEFING BODY
        </h3>
        
        <div 
          className="prose prose-invert max-w-none text-gray-300 font-sans text-sm md:text-base leading-relaxed space-y-4 break-words overflow-hidden [word-break:break-word]"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </div>

      {article.videoEmbed && (
        <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 md:p-8 space-y-4 overflow-hidden">
          <h3 className="text-xs text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2 font-bold">
            TACTICAL VIDEO FOOTAGE
          </h3>
          <div 
            className="w-full flex justify-center [&>iframe]:w-full [&>iframe]:max-w-2xl [&>iframe]:aspect-video [&>iframe]:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.videoEmbed }} 
          />
        </div>
      )}

      <CommentSection 
        slug={article.slug} 
        comments={article.comments || []} 
        submittingComment={submittingComment} 
        type="article" 
      />
    </article>
  );
}