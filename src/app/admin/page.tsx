'use client';

import { useState } from 'react';
import ArticleForm from './components/ArticleForm';
import BattleForm from './components/BattleForm';
import NewsForm from './components/news/NewsForm';

export default function AdminOverviewPage() {
  const [activeForm, setActiveForm] = useState<'article' | 'battle' | 'news'>('article');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Field Intelligence Operations
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveForm('article')}
            className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
              activeForm === 'article' ? 'bg-amber-600 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            + NEW ARTICLE
          </button>
          <button
            onClick={() => setActiveForm('battle')}
            className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
              activeForm === 'battle' ? 'bg-amber-600 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            + NEW BATTLE
          </button>
          <button
            onClick={() => setActiveForm('news')}
            className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
              activeForm === 'news' ? 'bg-amber-600 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            + NEW NEWS
          </button>
        </div>
      </div>

      {activeForm === 'article' && <ArticleForm />}
      {activeForm === 'battle' && <BattleForm />}
      {activeForm === 'news' && <NewsForm />}
    </div>
  );
}