'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

// Icons object
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
  About: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Bookmarks: () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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
  Search: () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

function NavbarContent() {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const bookmarks = useAppSelector((state: any) => state.bookmarks?.items || []);

  const navLinks = [
    { name: 'Battles', path: '/battles', icon: Icons.Battle },
    { name: 'Articles', path: '/articles', icon: Icons.Articles },
    { name: 'Defense News', path: '/news', icon: Icons.News },
    { name: 'About', path: '/about', icon: Icons.About },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    } else if (pathname !== '/search') {
      setSearchQuery('');
    }
  }, [searchParams, pathname]);

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
    setDrawerOpen(false);
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-4 md:px-6 bg-[#0b0f19] border-b border-gray-800/80 relative z-40 font-mono">
        {/* Left Side: Brand Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 focus:outline-none">
            <Image
              src="https://i.postimg.cc/FsJRPMys/web-logo.png"
              alt="BattleTheory Logo"
              width={240}
              height={60}
              className="h-10 md:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
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

        {/* Desktop Right Side Group */}
        <div className="hidden md:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan archives & battles..."
              className="w-full bg-[#121827] border border-gray-800 focus:border-amber-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all font-sans"
            />
          </form>

          {!mounted ? (
            <div className="h-8 w-24 bg-gray-800/50 rounded animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/bookmarks"
                title="Saved Intelligence & Bookmarks"
                className="relative p-2 bg-[#121827] border border-gray-800 hover:border-amber-500/50 rounded text-gray-300 hover:text-amber-500 transition-all flex items-center justify-center shrink-0"
              >
                <Icons.Bookmarks />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-md">
                    {bookmarks.length}
                  </span>
                )}
              </Link>

              <div className="relative shrink-0" ref={dropdownRef}>
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
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f1523] border border-gray-800 rounded-md shadow-xl py-2 text-xs font-mono z-50">
                    <div className="px-4 py-2 border-b border-gray-800/80">
                      <p className="text-gray-400 text-[10px] uppercase">Signed in as</p>
                      <p className="text-gray-200 font-bold truncate">{user?.email}</p>
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
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors uppercase font-bold border-t border-gray-800/50"
                    >
                      <Icons.Logout />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Header Action Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="p-2 text-gray-400 hover:text-amber-500 bg-[#121827] border border-gray-800 rounded-lg"
            aria-label="Toggle Search"
          >
            <Icons.Search />
          </button>

          {mounted && isAuthenticated && (
            <Link
              href="/bookmarks"
              className="relative p-2 bg-[#121827] border border-gray-800 rounded text-amber-500"
            >
              <Icons.Bookmarks />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 rounded-full">
                  {bookmarks.length}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 bg-[#121827] border border-gray-800 rounded-lg focus:outline-none"
            aria-label="Open Mobile Drawer"
          >
            <Icons.Menu />
          </button>
        </div>
      </nav>

      {/* Mobile Collapsible Search Input */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-[#0d1322] px-4 py-3 border-b border-gray-800">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan archives & battles..."
              className="w-full bg-[#121827] border border-gray-700 focus:border-amber-500 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-sans"
            />
          </form>
        </div>
      )}

      {/* Side Drawer Overlay Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Tactical Side Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0a0e17] border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col font-mono ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0d1322]">
          <span className="text-amber-500 font-black text-sm uppercase tracking-widest">
            Tactical Menu
          </span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close Drawer">
            <Icons.Close />
          </button>
        </div>

        {/* User Info Card (if logged in) */}
        {mounted && isAuthenticated && user && (
          <div className="p-4 bg-[#111726] border-b border-gray-800/80">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Operator Profile</p>
            <p className="text-sm font-bold text-white mt-0.5">
              Cmdr. <span className="text-amber-500">{user.username}</span>
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>
        )}

        {/* Navigation Links List */}
        <div className="flex-1 py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-xs uppercase font-bold tracking-wider transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <IconComponent />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {mounted && isAuthenticated && user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-xs uppercase font-bold tracking-wider text-amber-500 hover:bg-amber-500/10 transition-colors"
            >
              <Icons.Admin />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Drawer Footer / Auth Actions */}
        <div className="p-4 border-t border-gray-800/80 bg-[#0d1322]">
          {mounted && isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors"
            >
              <Icons.Logout />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setDrawerOpen(false)}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="bg-[#0b0f19] h-16 border-b border-gray-800" />}>
      <NavbarContent />
    </Suspense>
  );
}