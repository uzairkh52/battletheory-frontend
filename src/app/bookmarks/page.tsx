'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookmarks } from '@/store/slices/bookmarkSlice';
import BookmarkButton from '@/components/website/BookmarkButton';
import { Bookmark as BookmarkIcon, RefreshCw } from 'lucide-react';

export default function BookmarksPage() {
  const dispatch = useAppDispatch();
  const { items: bookmarks, loading } = useAppSelector((state: any) => state.bookmarks);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-amber-500 font-mono space-y-3 min-h-screen bg-[#0b0f19]">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm tracking-wider uppercase">RETRIEVING SAVED INTEL DOSSIERS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto space-y-6 pt-16">
        <div className="border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-black uppercase text-amber-500 tracking-wider flex items-center gap-3">
            <BookmarkIcon className="w-7 h-7 text-amber-500" />
            Saved Intelligence & Bookmarks ({bookmarks.length})
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Archived tactical records, battles, and field reports stored for rapid deployment.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-[#111827] border border-gray-800 p-12 rounded-lg text-center space-y-3">
            <BookmarkIcon className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-gray-400 text-xs uppercase tracking-wider">No bookmarked intelligence records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((item: any) => {
              const targetPath =
                item.itemType === 'battle'
                  ? `/battles/${item.slug}`
                  : item.itemType === 'article'
                  ? `/articles/${item.slug}`
                  : `/news/${item.slug}`;

              return (
                <div
                  key={item._id}
                  className="bg-[#111827] border border-gray-800 hover:border-amber-500/40 rounded-lg overflow-hidden flex flex-col justify-between p-4 transition-all group relative"
                >
                  <div className="flex gap-4">
                    {item.thumbnail && (
                      <div className="w-24 h-24 bg-black/40 flex-shrink-0 overflow-hidden rounded border border-gray-800">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-bold uppercase border border-amber-500/20">
                          {item.itemType}
                        </span>
                        {item.year && <span className="text-gray-400 font-bold">{item.year}</span>}
                      </div>
                      <Link href={targetPath} className="inline-block">
                        <h3 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors uppercase line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 font-sans">{item.summary}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-between items-center">
                    <Link
                      href={targetPath}
                      className="text-[10px] font-bold text-amber-500 hover:underline uppercase tracking-wider"
                    >
                      Access Dossier &rarr;
                    </Link>
                    <BookmarkButton
                      itemType={item.itemType}
                      itemId={item.itemId}
                      title={item.title}
                      slug={item.slug}
                      thumbnail={item.thumbnail}
                      theater={item.theater}
                      year={item.year}
                      summary={item.summary}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}