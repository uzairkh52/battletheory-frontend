'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllArticles,
  fetchArticleCategories,
  deleteArticle,
} from '@/store/slices/articleSlice';
import ArticleFormModal from '@/components/admin/ArticleFormModal';

export default function ManageArticlesPage() {
  const dispatch = useAppDispatch();
  const { articles, loading: isLoading, error } = useAppSelector((state) => state.articles);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllArticles());
    dispatch(fetchArticleCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const resultAction = await dispatch(deleteArticle(id));
    if (deleteArticle.rejected.match(resultAction)) {
      alert((resultAction.payload as string) || 'Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Manage Articles
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded uppercase hover:bg-amber-400 transition-colors font-mono"
        >
          + Add Article
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ LOADING ARTICLES... ]
        </p>
      ) : error ? (
        <div className="p-8 text-center border border-dashed border-red-900/50 rounded">
          <p className="text-xs font-mono text-red-500 uppercase">
            [ ERROR: {error} ]
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center hover:border-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-white uppercase">
                  {item.title}
                </h4>
                <p className="text-xs font-mono text-gray-500 line-clamp-1">
                  {item.summary || item.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-xs font-mono text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded transition-colors"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Form Modal Component */}
      <ArticleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}