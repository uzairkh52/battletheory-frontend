'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import ArticleFormFields from '../ArticleFormFields';

interface EditArticleFormProps {
  articleId: string;
}

export default function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featuredImage: '',
    videoEmbed: '',
    category: '',
  });

  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // 🌟 Form Submit Loading State
  const [addingCategory, setAddingCategory] = useState(false); // 🌟 Add Category Loading State
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  // Category management states for Edit Form
  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Fetch article categories safely
  const fetchCategories = async () => {
    try {
      const res = await API.get(API_ENDPOINTS.CATEGORIES.ARTICLES);
      const validCategories = (res.data || []).filter((cat: any) => cat.type !== 'battle');
      setLocalCategories(validCategories);
    } catch (err) {
      console.error('❌ Failed to fetch categories:', err);
      setLocalCategories([]);
    }
  };

  useEffect(() => {
    const fetchArticleAndCategories = async () => {
      try {
        await fetchCategories();
        const response = await API.get(`/articles/${articleId}`);
        const art = response.data;

        setFormData({
          title: art.title || '',
          slug: art.slug || '',
          summary: art.summary || '',
          content: art.content || '',
          featuredImage: art.featuredImage || '',
          videoEmbed: art.videoEmbed || '',
          category: art.category?._id || art.category || '',
        });

        if (art.tags && Array.isArray(art.tags)) {
          setTags(art.tags);
        }
      } catch (err: any) {
        setStatus({ type: 'error', msg: 'Failed to load article details.' });
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticleAndCategories();
    }
  }, [articleId]);

  const handleChange = (field: string, value: any) => {
    if (field === 'tags') {
      setTags(value);
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim() || addingCategory) return;
    setAddingCategory(true);
    try {
      const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-');
      const res = await API.post('/categories', { 
        name: newCatName.trim(), 
        slug, 
        type: 'article' 
      });

      await fetchCategories();
      
      if (res.data?._id) {
        setFormData((prev) => ({ ...prev, category: res.data._id }));
      }
      setNewCatName('');
      setShowAddCat(false);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to add article category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${catId}`);
      await fetchCategories();
      setFormData((prev) => ({ ...prev, category: '' }));
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert('Please select a Category!');
      return;
    }

    setStatus({ type: '', msg: '' });
    setSubmitting(true); // 🌟 Start Button Loading

    try {
      const payload = {
        ...formData,
        tags: tags,
      };

      await API.put(`/articles/${articleId}`, payload);
      setStatus({ type: 'success', msg: 'Article updated successfully!' });
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update article.' });
      setSubmitting(false); // 🌟 Stop Button Loading on Error
    }
  };

  if (loading) {
    return <div className="text-xs font-mono text-amber-500 animate-pulse p-6">[ DECRYPTING ARTICLE DATA... ]</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4 font-mono text-xs">
      <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">Edit Article Intelligence</h3>

      {status.msg && (
        <div className={`p-3 rounded text-xs font-mono border ${
          status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'
        }`}>
          {status.msg}
        </div>
      )}

      <ArticleFormFields 
        formData={formData}
        tags={tags}
        setTags={setTags}
        categories={localCategories}
        newCatName={newCatName}
        showAddCat={showAddCat}
        setNewCatName={setNewCatName}
        setShowAddCat={setShowAddCat}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onChange={handleChange}
        showSlug={true} 
        addingCategory={addingCategory}
      />

      {/* 🌟 Submit Button with Circular Spinner */}
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Updating Intel Record...</span>
          </>
        ) : (
          <span>Update Intel Record</span>
        )}
      </button>
    </form>
  );
}