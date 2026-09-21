import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111827] border-t border-gray-800 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <span className="text-xl font-black text-amber-500 uppercase tracking-wider">
            Battle Theory
          </span>
          <p className="text-xs leading-relaxed max-w-sm text-gray-400">
            High-precision military analysis, tactical history breakdowns, and modern defense tech intelligence platform.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tactical Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/battles" className="hover:text-amber-500 transition-colors">Battle Maps</Link></li>
            <li><Link href="/articles" className="hover:text-amber-500 transition-colors">Field Intelligence</Link></li>
            <li><Link href="/news" className="hover:text-amber-500 transition-colors">Defense Tech AI</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Command & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-amber-500 transition-colors">Terms of Clearance</Link></li>
            <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Dispatch / Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800/80 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Battle Theory Ops. All rights reserved.
      </div>
    </footer>
  );
}