'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Prevent Hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-[#0b0f19] border-b border-gray-800">
      <Link href="/" className="text-xl font-black text-amber-500 uppercase tracking-widest">
        BattleTheory
      </Link>

      <div className="flex items-center gap-4">
        {!mounted ? (
          // Placeholder during hydration to prevent flickering
          <div className="h-8 w-24 bg-gray-800/50 rounded animate-pulse" />
        ) : isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              Cmdr. <strong className="text-white">{user?.username}</strong>
            </span>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="bg-amber-600 text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-500 uppercase"
              >
                Admin Panel
              </Link>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-amber-600 text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-amber-500 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}