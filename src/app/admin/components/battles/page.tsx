'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function ManageBattlesPage() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/battles')
      .then((res) => setBattles(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider border-b border-gray-800 pb-4">
        Manage Battle Archives
      </h1>
      {loading ? (
        <p className="text-xs font-mono text-gray-500">Loading tactical battle data...</p>
      ) : battles.length === 0 ? (
        <p className="text-xs font-mono text-gray-500">No battle records found.</p>
      ) : (
        <div className="space-y-3">
          {battles.map((item: any) => (
            <div key={item._id} className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-white">{item.name} ({item.year})</h4>
                <span className="text-xs font-mono text-gray-500">{item.location}</span>
              </div>
              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Archived</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}