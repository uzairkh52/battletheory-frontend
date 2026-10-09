'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🌟 Router import karein
import API from '@/lib/api';
import ArticleFormFields from '../ArticleFormFields';

interface EditArticleFormProps {
  articleId: string;
}

export default function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter(); // 🌟 Router hook
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featuredImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await API.get(`/articles/${articleId}`);
        const art = response.data;
        setFormData({
          title: art.title || '',
          slug: art.slug || '',
          summary: art.summary || '',
          content: art.content || '',
          featuredImage: art.featuredImage || '',
        });
      } catch (err: any) {
        setStatus({ type: 'error', msg: 'Failed to load article details.' });
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      await API.put(`/articles/${articleId}`, formData);
      setStatus({ type: 'success', msg: 'Article updated successfully!' });
      setTimeout(() => {
        router.push('/admin/articles'); // 🌟 Update hone ke baad wapas manage page par bhej dein
      }, 1000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update article.' });
    }
  };

  if (loading) {
    return <div className="text-xs font-mono text-amber-500 animate-pulse p-6">[ DECRYPTING ARTICLE DATA... ]</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Edit Article Intelligence</h3>

      {status.msg && (
        <div className={`p-3 rounded text-xs font-mono border ${
          status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'
        }`}>
          {status.msg}
        </div>
      )}

      <ArticleFormFields formData={formData} onChange={handleChange} showSlug={true} />

      <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors font-mono">
        Update Intel Record
      </button>
    </form>
  );
}