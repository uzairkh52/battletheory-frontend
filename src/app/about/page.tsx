import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Map as MapIcon,
  BookOpen,
  Radio,
  Video,
  Search,
  Scale,
  ShieldCheck,
  ArrowRight,
  Mail,
} from 'lucide-react';

/* lucide-react ke naye versions mein brand icons hata diye gaye, isliye inline SVG */
type IconProps = { className?: string };

const Youtube = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
  </svg>
);

const Facebook = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z" />
  </svg>
);

const Instagram = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const Whatsapp = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://battletheory.net';
const YOUTUBE_URL = 'https://www.youtube.com/@BattleTheory39';
const FACEBOOK_URL = 'https://www.facebook.com/BattleTheory39';
const INSTAGRAM_URL = 'https://www.instagram.com/BattleTheory39';
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029VbE3Ks95q08fzKPjAL1W';

export const metadata: Metadata = {
  title: 'About Battle Theory',
  description:
    'Battle Theory tells stories from military history, with a focus on World War II: legendary battles, forgotten heroes, military technology, secret missions and the commanders behind them.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Battle Theory',
    description:
      'Military history storytelling, interactive battle maps and defense intelligence, built by and for history enthusiasts.',
    url: '/about',
    type: 'website',
  },
};

const PILLARS = [
  {
    icon: MapIcon,
    title: 'Battle Maps',
    text: 'Interactive geospatial maps that show how battles unfolded: where forces moved, where lines broke and why it mattered.',
    href: '/battles',
    cta: 'Open the maps',
  },
  {
    icon: BookOpen,
    title: 'Field Reports',
    text: 'In-depth articles on commanders, weapons, doctrine and the lesser-known stories of the war.',
    href: '/articles',
    cta: 'Read articles',
  },
  {
    icon: Radio,
    title: 'Defense Wire',
    text: 'A running feed of defense and military technology news, so history is never read in isolation from today.',
    href: '/news',
    cta: 'See the wire',
  },
  {
    icon: Video,
    title: 'Video Briefings',
    text: 'The same battles told in video form on the Battle Theory YouTube channel.',
    href: YOUTUBE_URL,
    cta: 'Watch on YouTube',
    external: true,
  },
];

const ERAS = [
  { label: 'World War I', years: '1914–1918', slug: 'ww1' },
  { label: 'World War II', years: '1939–1945', slug: 'ww2', core: true },
  { label: 'Cold War', years: '1947–1991', slug: 'cold-war' },
  { label: 'Modern Warfare', years: '1991–today', slug: 'modern' },
];

const STANDARDS = [
  {
    icon: Search,
    title: 'Research first',
    text: 'Every briefing starts from established historical records and cross-checked accounts, not from rumor or movie myth.',
  },
  {
    icon: Scale,
    title: 'Context over drama',
    text: 'We tell stories, but we explain the strategy, the numbers and the consequences behind them.',
  },
  {
    icon: ShieldCheck,
    title: 'Corrections welcome',
    text: 'History gets things wrong all the time. If you spot an error, tell us and we will review and fix it.',
  },
];

const STATS = [
  { value: '60K+', label: 'Community followers' },
  { value: '4', label: 'Eras covered' },
  { value: '3', label: 'Formats: maps, articles, video' },
];

const SOCIALS = [
  { icon: Youtube, label: 'YouTube', note: 'Video briefings', href: YOUTUBE_URL },
  { icon: Facebook, label: 'Facebook', note: '60K+ community', href: FACEBOOK_URL },
  { icon: Instagram, label: 'Instagram', note: 'Daily highlights', href: INSTAGRAM_URL },
  { icon: Whatsapp, label: 'WhatsApp', note: 'Tactical channel', href: WHATSAPP_URL },
];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}/about`,
    name: 'About Battle Theory',
    description:
      'Battle Theory tells stories from military history, with a focus on World War II.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Battle Theory',
      url: SITE_URL,
      founder: { '@type': 'Person', name: 'Uzair' },
      sameAs: [FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL, WHATSAPP_URL],
    },
  };

  return (
    <div className="space-y-14 sm:space-y-20 py-6 sm:py-10 font-mono text-white w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* 1. Hero */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative rounded-xl border border-amber-500/20 bg-gradient-to-br from-gray-900 via-[#111827] to-gray-900 p-6 sm:p-10 md:p-14 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
              [ About the archive ]
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight">
              History told with <span className="text-amber-500">maps, evidence</span> and context
            </h1>
            <p className="font-sans text-gray-300 text-base md:text-lg leading-relaxed">
              Battle Theory tells stories from military history, with a focus on World War II:
              legendary battles, forgotten heroes, military technology, secret missions, and the
              commanders and strategies that shaped them.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/battles"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-3 rounded text-xs uppercase tracking-widest transition-colors shadow-lg shadow-amber-600/20"
              >
                Explore the maps <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/articles"
                className="border border-gray-700 bg-gray-800/50 text-gray-200 px-6 py-3 rounded font-bold hover:border-amber-500/50 hover:text-amber-500 transition-colors text-xs uppercase tracking-widest"
              >
                Read the articles
              </Link>
            </div>
          </div>

          <dl className="relative mt-10 pt-6 border-t border-gray-800 grid grid-cols-3 gap-4 md:gap-0 md:divide-x md:divide-gray-800">
            {STATS.map((s) => (
              <div key={s.label} className="md:px-8 md:first:pl-0 flex flex-col gap-1">
                <dd className="font-sans text-2xl md:text-4xl font-black text-amber-500 leading-none">
                  {s.value}
                </dd>
                <dt className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wider">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* 2. Mission */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">Our mission</h2>
            <p className="font-sans text-2xl md:text-3xl font-black uppercase leading-tight">
              Make military history clear, accurate and worth your time
            </p>
          </div>
          <div className="md:col-span-3 space-y-4 font-sans text-gray-300 text-base leading-relaxed">
            <p>
              Most battles are remembered as a name and a date. Battle Theory exists to show what
              happened in between: the decisions, the terrain, the logistics and the people who
              lived through it.
            </p>
            <p>
              We combine written analysis, interactive maps and video so you can understand a
              battle at the level you want, from a five-minute story to a full tactical
              breakdown. We also follow modern defense technology, because the questions of
              yesterday&rsquo;s wars keep returning in new forms.
            </p>
          </div>
        </section>
      </div>

      {/* 3. What you will find */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6">
          <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase border-b border-gray-800 pb-2">
            What you will find here
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              const inner = (
                <>
                  <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <h3 className="font-sans text-lg font-black uppercase group-hover:text-amber-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-400 leading-relaxed">{p.text}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-amber-500">
                      {p.cta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </>
              );
              const cls =
                'group flex gap-4 bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded-xl p-5 md:p-6 transition-colors';
              return p.external ? (
                <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={p.title} href={p.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* 4. Eras */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">
              Eras we cover
            </h2>
            <span className="text-[11px] text-gray-500 uppercase">WWII is our core focus</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ERAS.map((era) => (
              <Link
                key={era.slug}
                href={`/battles?era=${era.slug}`}
                className={`relative rounded-lg p-5 border transition-colors hover:border-amber-500/60 ${
                  era.core
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#111827] border-gray-800'
                }`}
              >
                {era.core && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase text-amber-400">
                    Core
                  </span>
                )}
                <p className="font-sans text-white font-black uppercase text-sm">{era.label}</p>
                <p className="text-xs text-gray-500 mt-1">{era.years}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Standards */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6 bg-[#0b1220] border border-gray-800 rounded-xl p-6 md:p-10">
          <div className="space-y-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">
              How we work
            </h2>
            <p className="font-sans text-xl md:text-2xl font-black uppercase leading-tight max-w-2xl">
              Our editorial standards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STANDARDS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="space-y-3">
                  <Icon className="w-6 h-6 text-amber-500" />
                  <h3 className="font-sans text-base font-black uppercase">{s.title}</h3>
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 6. Who is behind */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-6 md:p-10 grid md:grid-cols-5 gap-6 md:gap-10 items-center">
          <div className="md:col-span-2 space-y-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">
              Behind Battle Theory
            </h2>
            <p className="font-sans text-2xl font-black uppercase leading-tight">Uzair</p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Founder &amp; researcher</p>
          </div>
          <p className="md:col-span-3 font-sans text-gray-300 leading-relaxed">
            Battle Theory started as a passion for understanding how wars were really won and
            lost. It grew into a growing community of readers, viewers and researchers who care
            about getting the story right. Every map, article and video is built to respect the
            people who lived it and the readers who want the real picture.
          </p>
        </section>
      </div>

      {/* 7. Community */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6">
          <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase border-b border-gray-800 pb-2">
            Join the community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded-xl p-5 transition-colors"
                >
                  <Icon className="w-7 h-7 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-sans font-black uppercase group-hover:text-amber-500 transition-colors">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-gray-500 uppercase">{s.note}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </a>
              );
            })}
          </div>
        </section>
      </div>

      {/* 8. Contact CTA */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#111827] to-amber-950/40 p-8 md:p-10 text-center space-y-4">
          <h2 className="font-sans text-2xl md:text-3xl font-black uppercase">
            Found an error or have a story idea?
          </h2>
          <p className="font-sans text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Corrections, suggestions and topic requests are always welcome. Send us a dispatch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-3 rounded text-xs uppercase tracking-widest transition-colors"
          >
            <Mail className="w-4 h-4" /> Contact us
          </Link>
          <p className="text-[11px] text-gray-600 pt-2">
            Battle Theory content is created for educational and historical purposes.
          </p>
        </section>
      </div>
    </div>
  );
}