'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createArticle } from '@/store/slices/articleSlice';
import ArticleFormFields from './ArticleFormFields';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleFormModal({ isOpen, onClose }: ArticleFormModalProps) {
  const dispatch = useAppDispatch();
  const { creating: isCreating } = useAppSelector((state) => state.articles);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    featuredImage: '',
    videoEmbed: '',
    category: '',
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching Categories Endpoint:', API_ENDPOINTS.CATEGORIES.ARTICLES);
      const res = await API.get(API_ENDPOINTS.CATEGORIES.ARTICLES); 
      console.log('📦 API Category Response Data:', res.data);
      
      // Strict filter taake battle type categories agar aa bhi jayein toh exclude ho jayein
      const validCategories = (res.data || []).filter((cat: any) => cat.type !== 'battle');
      
      setLocalCategories(validCategories);
    } catch (err) {
      console.error('❌ Failed to fetch article categories:', err);
      setLocalCategories([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    if (field === 'tags') {
      setTags(value);
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-');
      console.log('➕ Creating new category:', { name: newCatName.trim(), slug, type: 'article' });
      
      const res = await API.post('/categories', { 
        name: newCatName.trim(), 
        slug, 
        type: 'article' 
      });

      console.log('✅ New Category Created Response:', res.data);
      
      // Fetch refreshed categories list after creation
      await fetchCategories();
      
      // Auto-select newly created category ID
      if (res.data?._id) {
        setFormData((prev) => ({ ...prev, category: res.data._id }));
      }
      setNewCatName('');
      setShowAddCat(false);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to add article category');
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

    const slug = generateSlug(formData.title);

    const resultAction = await dispatch(
      createArticle({
        title: formData.title,
        slug,
        summary: formData.summary,
        content: formData.content,
        featuredImage: formData.featuredImage,
        videoEmbed: formData.videoEmbed,
        category: formData.category,
        tags: tags,
      })
    );

    if (createArticle.fulfilled.match(resultAction)) {
      setFormData({ title: '', summary: '', content: '', featuredImage: '', videoEmbed: '', category: '' });
      setTags([]);
      onClose();
    } else {
      alert((resultAction.payload as string) || 'Failed to save article');
    }
  };

  // Strictly use localCategories to avoid mixing up with redux battle categories
  const availableCategories = localCategories;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-[#111827] border border-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-wider">
            Create New Article
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ArticleFormFields
            formData={formData}
            tags={tags}
            setTags={setTags}
            categories={availableCategories}
            newCatName={newCatName}
            showAddCat={showAddCat}
            setNewCatName={setNewCatName}
            setShowAddCat={setShowAddCat}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onChange={handleChange}
            showSlug={false}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? 'Saving...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}