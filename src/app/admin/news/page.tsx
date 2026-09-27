'use client';

import NewsForm from '../components/news/NewsForm';
import NewsAdminList from '../components/news/NewsAdminList';

export default function AdminNewsPage() {
  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Defense Intelligence News Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Create, edit, and sync automated defense feeds for BattleTheory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NewsForm />
        <NewsAdminList />
      </div>
    </div>
  );
}