'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
import { NewsItem } from '@/types';

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await API.get('/news');
        setNewsList(data);
      } catch (err) {
        console.error('Failed to fetch defense news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-amber-500 font-mono">MONITORING DEFENSE INTELLIGENCE FEEDS...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-black uppercase text-amber-500 tracking-wider">
          AI & Modern Defense News
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Automated intelligence tracking autonomous systems, military AI integration, and next-gen defense tech.
        </p>
      </div>

      <div className="space-y-4">
        {newsList.length === 0 ? (
          <p className="text-gray-500">No active defense intelligence alerts at this moment.</p>
        ) : (
          newsList.map((item) => (
            <div key={item._id} className="military-card p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                    {item.category || 'DEFENSE TECH'}
                  </span>
                  <span className="text-gray-500">Source: <strong className="text-gray-300">{item.source}</strong></span>
                </div>
                <h2 className="text-lg font-bold text-white hover:text-amber-500 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-400 max-w-3xl">{item.summary}</p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amber-glow-btn text-xs font-bold whitespace-nowrap self-start md:self-center"
                >
                  Source Brief →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}