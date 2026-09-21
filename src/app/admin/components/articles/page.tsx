'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/articles')
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider border-b border-gray-800 pb-4">
        Manage Articles
      </h1>
      {loading ? (
        <p className="text-xs font-mono text-gray-500">Loading intelligence data...</p>
      ) : articles.length === 0 ? (
        <p className="text-xs font-mono text-gray-500">No articles published yet.</p>
      ) : (
        <div className="space-y-3">
          {articles.map((item: any) => (
            <div key={item._id} className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <span className="text-xs font-mono text-gray-500">{item.slug}</span>
              </div>
              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Published</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}