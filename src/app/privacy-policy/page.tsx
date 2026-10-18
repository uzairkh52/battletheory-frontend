import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ArrowLeft, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Security Protocols | Battle Theory',
  description:
    'Declassified data privacy statement, security protocols, user tracking policy, and cookie management guidelines for Battle Theory.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 13, 2026';

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 md:p-10 font-mono text-white">
      {/* Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Return to Command Center</span>
      </Link>

      {/* Hero Header Banner */}
      <div className="relative border border-amber-500/20 bg-black/40 rounded-lg p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            SECURITY DIRECTIVE // CLASSIFIED PRIVACY PROTOCOL
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider">
            PRIVACY <span className="text-amber-500">POLICY</span>
          </h1>

          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Data protection directives, user telemetry compliance, and operational privacy guidelines governing the Battle Theory intelligence platform.
          </p>

          <div className="pt-2 text-[11px] text-gray-500">
            EFFECTIVE PROTOCOL DATE: <span className="text-amber-500">{lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-gray-300 text-xs md:text-sm leading-relaxed font-sans">
        
        {/* Section 1 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>01. OPERATIONAL OVERVIEW & DATA TELEMETRY</span>
          </div>
          <p>
            Battle Theory (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates as a military history research, geospatial analytics, and defense technology platform. We prioritize privacy, security, and data minimization. This Privacy Policy outlines the types of information collected when users visit our web properties, interact with historical briefings, or access defense intelligence feeds.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Eye className="w-4 h-4 text-amber-500" />
            <span>02. INFORMATION COLLECTION PROTOCOLS</span>
          </div>
          <p>We collect minimal telemetry data required to ensure optimal system performance and platform security:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
            <li>
              <strong className="text-white font-mono">Automated Technical Logs:</strong> IP address, browser architecture, user agent, requested URLs, and request timestamps for cybersecurity auditing and rate limiting.
            </li>
            <li>
              <strong className="text-white font-mono">User Activity & Bookmarks:</strong> Saved dossiers, bookmarked battles, and research preferences stored locally on your client device via browser Storage.
            </li>
            <li>
              <strong className="text-white font-mono">Communications Data:</strong> Information submitted voluntarily through feedback channels or research contact forms.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>03. COOKIES & TRACKING TECHNOLOGIES</span>
          </div>
          <p>
            Battle Theory uses functional cookies and browser storage technologies strictly to enhance site performance, store user interface state (such as dark mode preferences and active filters), and aggregate anonymous traffic metrics. We do not engage in cross-site identity tracking or unauthorized data resale.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>04. THIRD-PARTY INTELLIGENCE SOURCES & LINKS</span>
          </div>
          <p>
            Our Defense Intelligence Feed indexes external research and news publications. Battle Theory does not control and is not responsible for the privacy practices, tracking mechanisms, or content policies of third-party external websites linked from our platform. Users are advised to inspect the privacy policies of external sites.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>05. DATA SECURITY PROTOCOLS & ENCRYPTION</span>
          </div>
          <p>
            All communications between client devices and Battle Theory endpoints are secured using industry-standard TLS/SSL encryption. We maintain active firewall barriers, rate limiters, and perimeter monitoring to prevent unauthorized access, manipulation, or disclosure of platform logs.
          </p>
        </section>

        {/* Contact Directive */}
        <div className="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-lg space-y-2 font-mono">
          <div className="text-amber-500 font-bold uppercase text-xs tracking-widest">
            SECURITY & PRIVACY INQUIRIES
          </div>
          <p className="text-gray-300 text-xs">
            For questions, telemetry clearance requests, or privacy protocols regarding the Battle Theory platform, contact our communications desk at:{' '}
            <a
              href="mailto:contact@battletheory.com"
              className="text-amber-500 underline font-bold hover:text-amber-400"
            >
              contact@battletheory.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}