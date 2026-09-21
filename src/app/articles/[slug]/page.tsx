'use client';

import { useEffect, useState, use } from 'react';
import API from '@/lib/api';
import Link from 'next/link';

interface Comment {
  _id: string;
  author?: { username: string };
  text: string;
  createdAt: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  createdAt: string;
  comments?: Comment[];
}

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams?.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchArticle = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const cleanSlug = decodeURIComponent(slug);
      const res = await API.get(`/articles/${cleanSlug}`);
      setArticle(res.data);
      setError(false);
    } catch (err) {
      console.error('Failed to fetch article briefing:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !article) return;

    setSubmitting(true);
    try {
      await API.post(`/articles/${article._id}/comments`, { text: newComment });
      setNewComment('');
      fetchArticle();
    } catch (err: any) {
      console.error('Comment error details:', err.response?.data || err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to post comment.';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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
          The requested tactical article dossier does not exist or has been redacted.
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

  return (
    <article className="max-w-4xl mx-auto my-8 space-y-8 px-4">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
        <Link href="/articles" className="hover:text-amber-500 transition-colors">
          ARCHIVES
        </Link>
        <span>/</span>
        <span className="text-amber-500 uppercase">{article.slug}</span>
      </div>

      {/* Header */}
      <header className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
            TACTICAL ANALYSIS
          </span>
          <span className="text-xs font-mono text-gray-500">
            LOG DATE: {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm font-mono text-gray-400 border-l-2 border-amber-500 pl-4 py-1 italic bg-[#0b0f19]">
          "{article.summary}"
        </p>
      </header>

      {/* Main Body */}
      <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
        <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          DECLASSIFIED BRIEFING BODY
        </h3>
        <div className="prose prose-invert max-w-none text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
          {article.content}
        </div>
      </div>

      {/* Comments Section */}
      <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-6">
        <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          TACTICAL DEBRIEFING & COMMENTS ({article.comments?.length || 0})
        </h3>

        {/* Comment Input Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Log tactical observation..."
            rows={3}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
          >
            {submitting ? 'TRANSMITTING...' : 'POST DEBRIEFING'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((c) => (
              <div key={c._id} className="p-3 bg-[#0b0f19] border border-gray-800 rounded space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-amber-500 font-bold">
                    {c.author?.username || 'GUEST OPERATIVE'}
                  </span>
                  <span className="text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-300">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-gray-500">No field observations recorded yet.</p>
          )}
        </div>
      </section>
    </article>
  );
}