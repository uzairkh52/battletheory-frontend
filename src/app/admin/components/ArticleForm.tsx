'use client';

import { useState } from 'react';
import API from '@/lib/api';
import ArticleFormFields from '@/components/admin/ArticleFormFields';

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featuredImage: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      await API.post('/articles', formData);
      setStatus({ type: 'success', msg: 'Article published successfully!' });
      setFormData({ title: '', slug: '', summary: '', content: '', featuredImage: '' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to publish article.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Create New Article</h3>

      {status.msg && (
        <div className={`p-3 rounded text-xs font-mono border ${
          status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'
        }`}>
          {status.msg}
        </div>
      )}

      <ArticleFormFields formData={formData} onChange={handleChange} showSlug={true} />

      <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors">
        Deploy Article
      </button>
    </form>
  );
}