'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

// Clean SVG Icons (Consistent Material/Tactical Amber Monochrome Style)
const Icons = {
  Battle: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  Articles: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  News: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const navLinks = [
    { name: 'Battles', path: '/battles', icon: Icons.Battle },
    { name: 'Articles', path: '/articles', icon: Icons.Articles },
    { name: 'Defense News', path: '/news', icon: Icons.News },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <nav className="flex justify-between items-center py-4 px-6 bg-[#0b0f19] border-b border-gray-800/80 relative z-50 font-mono">
      {/* Brand & Monochromatic Icon Navigation Links */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
          BattleTheory
        </Link>

        {/* Navigation Links Always Visible */}
        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'text-amber-500 border-b-2 border-amber-500 pb-1'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Actions & Dropdown Menu */}
      <div className="flex items-center gap-4">
        {!mounted ? (
          <div className="h-8 w-24 bg-gray-800/50 rounded animate-pulse" />
        ) : isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#121827] border border-gray-800 hover:border-amber-500/50 text-gray-300 px-3 py-1.5 rounded text-xs transition-all focus:outline-none"
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

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0f1523] border border-gray-800 rounded-md shadow-xl py-2 text-xs font-mono z-50">
                <div className="px-4 py-2 border-b border-gray-800/80">
                  <p className="text-gray-400 text-[10px] uppercase">Signed in as</p>
                  <p className="text-gray-200 font-bold truncate">{user?.email}</p>
                </div>

                <div className="md:hidden border-b border-gray-800/80 py-1">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-amber-500 uppercase font-bold"
                      >
                        <IconComponent />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-amber-500 hover:bg-amber-500/10 transition-colors uppercase font-bold"
                  >
                    <Icons.Admin />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors uppercase font-bold"
                >
                  <Icons.Logout />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}