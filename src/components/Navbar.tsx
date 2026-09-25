'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Hydration mismatch prevent karne ke liye
  useEffect(() => {
    setMounted(true);
  }, []);

  // Menu ke bahar click karne par dropdown close karne ke liye handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-[#0b0f19] border-b border-gray-800 relative z-50">
      <Link href="/" className="text-xl font-black text-amber-500 uppercase tracking-widest">
        BattleTheory
      </Link>

      <div className="flex items-center gap-4">
        {!mounted ? (
          // Hydration placeholder
          <div className="h-8 w-24 bg-gray-800/50 rounded animate-pulse" />
        ) : isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            {/* User Dropdown Trigger Button */}
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#121827] border border-gray-800 hover:border-amber-500/50 text-gray-300 px-3 py-1.5 rounded text-sm transition-all focus:outline-none"
            >
              <span>
                Cmdr. <strong className="text-amber-500 font-bold">{user?.username}</strong>
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0f1523] border border-gray-800 rounded-md shadow-xl py-2 text-xs font-mono">
                <div className="px-4 py-2 border-b border-gray-800/80">
                  <p className="text-gray-400">Signed in as</p>
                  <p className="text-gray-200 font-bold truncate">{user?.email}</p>
                </div>

                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-amber-500 hover:bg-amber-500/10 transition-colors uppercase font-bold"
                  >
                    <span>🛡️</span> Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors uppercase font-bold"
                >
                  <span>🚪</span> Terminate Session (Logout)
                </button>
              </div>
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