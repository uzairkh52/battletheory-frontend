'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: '📊 Overview', path: '/admin' },
    { name: '📰 Articles', path: '/admin/articles' },
    { name: '🗺️ Battles', path: '/admin/battles' },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6 space-y-6 flex flex-col justify-between min-h-[75vh]">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
            COMMAND CENTER
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">Admin Panel</h2>
        </div>

        <nav className="space-y-2 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2.5 rounded transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <Link
          href="/"
          className="text-xs font-mono text-gray-500 hover:text-amber-500 transition-colors flex items-center gap-2"
        >
          ← Back to Main Site
        </Link>
      </div>
    </aside>
  );
}