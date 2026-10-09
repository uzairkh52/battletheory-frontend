'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmarkAPI } from '@/store/slices/bookmarkSlice';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  itemType: 'battle' | 'article' | 'news';
  itemId: string;
  title: string;
  slug: string;
  thumbnail?: string;
  theater?: string;
  year?: string;
  summary?: string;
}

export default function BookmarkButton(props: BookmarkButtonProps) {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state: any) => state.bookmarks.items);
  const isAuthenticated = useAppSelector((state: any) => state.auth.isAuthenticated);

  const isBookmarked = bookmarks.some((b: any) => b.itemId === props.itemId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Link wrapping ko prevent karne ke liye
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Commander, please login to save intel bookmarks.');
      return;
    }

    dispatch(toggleBookmarkAPI(props));
  };

  return (
    <button
      onClick={handleToggle}
      title={isBookmarked ? 'Remove Bookmark' : 'Save Intel Bookmark'}
      className={`p-2 rounded border transition-all flex items-center justify-center ${
        isBookmarked
          ? 'bg-amber-500 text-black border-amber-500'
          : 'bg-[#111827] text-gray-400 border-gray-800 hover:border-amber-500/50 hover:text-white'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black' : ''}`} />
    </button>
  );
}