import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, FileText, AlertTriangle, Scale, ArrowLeft, Terminal, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Battle Theory Protocols',
  description:
    'Terms of service, operational protocols, intellectual property rights, and user compliance directives for the Battle Theory platform.',
};

export default function TermsAndConditionsPage() {
  const effectiveDate = 'October 13, 2026';

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
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            OPERATIONAL DIRECTIVE // LEGAL TERMS & CONDITIONS
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider">
            TERMS & <span className="text-amber-500">CONDITIONS</span>
          </h1>

          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Standard operating conditions, content licensing directives, and liability limitations governing user engagement across Battle Theory intelligence properties.
          </p>

          <div className="pt-2 text-[11px] text-gray-500">
            DIRECTIVE EFFECTIVE DATE: <span className="text-amber-500">{effectiveDate}</span>
          </div>
        </div>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-8 text-gray-300 text-xs md:text-sm leading-relaxed font-sans">
        
        {/* Section 1 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>01. ACCEPTANCE OF OPERATIONAL TERMS</span>
          </div>
          <p>
            By accessing, browsing, or utilizing the Battle Theory platform, interactive geospatial maps, or research briefings, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these operational guidelines, you are prohibited from accessing the platform endpoints.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>02. INTELLECTUAL PROPERTY & BRIEFING RIGHTS</span>
          </div>
          <p>
            All original research dossiers, tactical visualizers, channel branding elements, custom software interfaces, and media productions published under the Battle Theory brand are protected by international copyright and intellectual property laws:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
            <li>
              <strong className="text-white font-mono">Personal & Educational Use:</strong> Permission is granted to temporarily access and review research briefings for personal, non-commercial educational analysis.
            </li>
            <li>
              <strong className="text-white font-mono">Prohibited Exploitation:</strong> You may not modify, distribute, mirror, scrape, or commercially exploit any proprietary Battle Theory graphics, video assets, or dynamic visualizers without prior written consent.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>03. ACCEPTABLE USE & SYSTEM INTEGRITY</span>
          </div>
          <p>
            Users agree not to engage in actions that impair system availability or security, including but not limited to: automated endpoint scraping exceeding rate limits, attempting unauthorized access to server infrastructure, or utilizing platform communication tools to distribute malicious payloads.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>04. DISCLAIMER & ACCURACY OF INTELLIGENCE</span>
          </div>
          <p>
            Historical engagement analyses, geospatial battle data, and military technological briefings provided on Battle Theory are compiled for informational and historical research purposes. While we strive for rigorous research standards, content is provided &quot;as is&quot; without warranties regarding absolute completeness or realtime operational accuracy.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-amber-500 font-bold uppercase text-xs md:text-sm border-b border-gray-800 pb-3">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>05. LIMITATION OF LIABILITY</span>
          </div>
          <p>
            In no event shall Battle Theory or its team be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the platform, historical archives, or third-party intelligence feeds indexed within our feeds.
          </p>
        </section>

        {/* Contact Directive */}
        <div className="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-lg space-y-2 font-mono">
          <div className="text-amber-500 font-bold uppercase text-xs tracking-widest">
            LEGAL DIRECTIVE & COMPLIANCE ENQUIRIES
          </div>
          <p className="text-gray-300 text-xs">
            For legal inquiries, content licensing requests, or terms compliance questions, submit formal communications to:{' '}
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