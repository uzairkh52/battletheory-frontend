'use client';

import { useState } from 'react';
import AdminGuard from './components/AdminGuard';
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Mobile Header Bar with Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-[#111827] border border-gray-800 p-4 rounded-xl mb-4 font-mono">
          <div>
            <span className="text-[10px] text-amber-500 uppercase tracking-widest block">COMMAND CENTER</span>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Admin Panel</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white bg-[#0b0f19] border border-gray-800 rounded"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-amber-500" /> : <Menu className="w-5 h-5 text-amber-500" />}
          </button>
        </div>

        {/* Main Wrapper Layout */}
        <div className="flex min-h-[80vh] border border-gray-800 rounded-xl overflow-hidden bg-[#0b0f19] relative">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Mobile Slide-over Sidebar Drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative w-64 bg-[#111827] border-r border-gray-800 flex flex-col z-10">
                <Sidebar onItemClick={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <section className="flex-1 p-4 md:p-8 bg-[#0b0f19] overflow-y-auto w-full">
            {children}
          </section>
        </div>
      </div>
    </AdminGuard>
  );
}