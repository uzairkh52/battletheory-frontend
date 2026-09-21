'use client';

import AdminGuard from './components/AdminGuard';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-[80vh] border border-gray-800 rounded-xl overflow-hidden bg-[#0b0f19] mt-4">
        <Sidebar />
        <section className="flex-1 p-8 bg-[#0b0f19] overflow-y-auto">
          {children}
        </section>
      </div>
    </AdminGuard>
  );
}