'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import { Plus, Trash2, Edit, FileText, AlertCircle } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await API.get('/articles');
      setArticles(response.data);
    } catch (err: any) {
      setError('Failed to fetch tactical articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this intelligence record?')) return;
    try {
      await API.delete(`/articles/${id}`);
      setArticles(articles.filter((art) => art._id !== id));
    } catch (err: any) {
      alert('Failed to delete article.');
    }
  };

  if (loading) {
    return (
      <div className="text-xs font-mono text-amber-500 animate-pulse p-6">
        [ DECRYPTING ARTICLES ARCHIVE... ]
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      {/* 🌟 Fully Responsive Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            Field Intelligence Operations
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage tactical intelligence archives, articles, and records.
          </p>
        </div>

        {/* Action Buttons (Stacked on mobile, row on tablet/desktop) */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors text-center flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
          <Link
            href="/admin/battles/new"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors border border-gray-700 text-center flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Battle</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Articles List / Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Active Records ({articles.length})</span>
        </div>

        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            No intelligence records found in database.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {articles.map((art) => (
              <div key={art._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-900/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{art.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{art.excerpt || 'No summary provided.'}</p>
                  <span className="text-[10px] text-gray-500">Slug: {art.slug}</span>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Link
                    href={`/admin/articles/edit/${art._id}`}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-amber-500 rounded border border-gray-700 transition-colors"
                    title="Edit Record"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded border border-red-800/50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}