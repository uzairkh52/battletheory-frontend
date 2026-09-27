'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Newspaper, Swords, Radio, ArrowLeft } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Articles', path: '/admin/articles', icon: Newspaper },
    { name: 'Battles', path: '/admin/battles', icon: Swords },
    { name: 'Defense News', path: '/admin/news', icon: Radio },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6 space-y-6 flex flex-col justify-between min-h-[75vh] font-mono">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] text-amber-500 uppercase tracking-widest block">
            COMMAND CENTER
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">Admin Panel</h2>
        </div>

        <nav className="space-y-2 text-xs font-bold uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-amber-500 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </aside>
  );
}