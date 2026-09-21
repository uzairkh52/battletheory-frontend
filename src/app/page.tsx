import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative rounded-xl border border-amber-500/20 bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
            Tactical Operations Archive
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            DEEP-DIVE MILITARY HISTORY & TACTICAL ANALYSIS
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Unraveling pivotal battles, war doctrines, and high-performance military innovations with high-precision historical breakdowns.
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="/articles" className="amber-glow-btn shadow-lg shadow-amber-600/20">
              Explore Articles
            </Link>
            <Link href="/battles" className="border border-gray-700 bg-gray-800/50 text-gray-200 px-6 py-2.5 rounded font-semibold hover:border-amber-500/50 hover:text-amber-500 transition-all text-sm">
              View Battle Maps
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold tracking-wider text-amber-500 uppercase border-b border-gray-800 pb-2">
          Latest Field Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="military-card p-5 space-y-3">
            <span className="text-xs text-amber-500 font-mono">WWII / ARMOR DOCTRINE</span>
            <h3 className="text-lg font-bold text-white">Operational Panther: Mechanical Flaws at Kursk</h3>
            <p className="text-sm text-gray-400">Analysis of Panther tank deployment during Operation Citadel and its transmission failures.</p>
            <Link href="/articles" className="inline-block text-xs font-bold text-amber-500 hover:underline pt-2">
              Read Analysis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}