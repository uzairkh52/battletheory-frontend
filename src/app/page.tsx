'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllArticles } from '@/store/slices/articleSlice';
import { fetchNewsList } from '@/store/slices/newsSlice';
import { fetchAllBattles } from '@/store/slices/battleSlice';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/slider.scss';

const SITE_URL = 'https://www.battletheory.net';
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCKGJjeciArs_N-1jbUGtMrg';
const FACEBOOK_URL = 'https://www.facebook.com/BattleTheory39';

const FALLBACK_BATTLE_IMG =
  'https://images.unsplash.com/photo-1579965101323-8832a84a6b57?w=600&auto=format&fit=crop&q=60';
const FALLBACK_ARTICLE_IMG =
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60';

const ERAS = [
  { label: 'World War I', years: '1914–1918', slug: 'ww1' },
  { label: 'World War II', years: '1939–1945', slug: 'ww2' },
  { label: 'Cold War', years: '1947–1991', slug: 'cold-war' },
  { label: 'Modern Warfare', years: '1991–today', slug: 'modern' },
];

const stripHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

const hasImage = (b: any) =>
  typeof b?.featuredImage === 'string' && b.featuredImage.trim() !== '';

export default function Home() {
  const dispatch = useAppDispatch();

  const { articles = [], loading: loadingArticles } = useAppSelector((state: any) => state.articles);
  const newsState = useAppSelector((state: any) => state.news);
  const { battles = [], loading: loadingBattles } = useAppSelector((state: any) => state.battles);

  const defenseNewsItems = Array.isArray(newsState?.news?.news)
    ? newsState.news.news
    : Array.isArray(newsState?.items?.news)
    ? newsState.items.news
    : Array.isArray(newsState?.news)
    ? newsState.news
    : Array.isArray(newsState?.items)
    ? newsState.items
    : [];

  const loadingNews = newsState?.loading || false;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBattles());
    dispatch(fetchAllArticles());
    dispatch(fetchNewsList());
  }, [dispatch]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Hero: sab se latest 3 battles (image wali). createdAt/updatedAt se sort, warna API order
  // Hero: sab se latest battles (agar 3 se kam hon toh saari available le le ga)
  const heroBattles = useMemo(() => {
    const time = (b: any) => new Date(b.createdAt || b.updatedAt || 0).getTime() || 0;
    const withImg = battles.filter(
      (b: any) => hasImage(b) && !/prisoner/i.test(b.theater || '')
    );
    const hasDates = withImg.some((b: any) => time(b) > 0);
    const sorted = hasDates ? [...withImg].sort((x: any, y: any) => time(y) - time(x)) : withImg;
    
    // Agar sorted 3 se kam hain, toh baaki battles ko bhi (bina image filter ke ya fallback image ke sath) shamil kar lo taake kam az kam 3 poori ho sakein
    if (sorted.length < 3 && battles.length > 0) {
      const remaining = battles.filter((b: any) => !sorted.includes(b));
      return [...sorted, ...remaining].slice(0, 3);
    }
    
    return sorted.slice(0, 3);
  }, [battles]);

  const stats = [
    { value: '60K+', label: 'Trusted community' },
    { value: '✓', label: 'Well-researched & verified' },
    { value: battles.length > 0 ? `${battles.length}` : '—', label: 'Battles mapped' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Battle Theory',
        description:
          'Tactical history, battle maps, declassified archives, and modern military tech analysis.',
        publisher: { '@id': `${SITE_URL}/#org` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'Battle Theory',
        url: SITE_URL,
        logo: 'https://i.postimg.cc/FsJRPMys/web-logo.png',
        sameAs: [
          FACEBOOK_URL,
          'https://www.instagram.com/BattleTheory39',
          YOUTUBE_URL,
        ],
      },
    ],
  };

  return (
    <div className="space-y-14 py-6 font-mono w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* 1. Hero */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative rounded-xl border border-amber-500/20 bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                [ TACTICAL OPERATIONS ARCHIVE v1.3 ]
              </span>
              <h1 className="v1 text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
                Deep-dive military history & tactical analysis
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                Unraveling pivotal battles, war doctrines, and high-performance military innovations
                with high-precision historical breakdowns and interactive geospatial intelligence maps.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/battles"
                  className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-3 rounded text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20"
                >
                  Launch Tactical Map →
                </Link>
                <Link
                  href="/articles"
                  className="border border-gray-700 bg-gray-800/50 text-gray-200 px-6 py-3 rounded font-bold hover:border-amber-500/50 hover:text-amber-500 transition-all text-xs uppercase tracking-widest"
                >
                  Browse Articles
                </Link>
              </div>
            </div>

            {/* Latest 3 battles: drag / swipe carousel */}
            {heroBattles.length > 0 && (
              <div className="md:col-span-2 relative rounded-lg overflow-hidden border border-gray-800 aspect-[4/3]">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  grabCursor={true}
                  simulateTouch={true}
                  loop={heroBattles.length > 1}
                  autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  pagination={{ clickable: true }}
                  className="hero-slider h-full w-full [&_.swiper-pagination]:!bottom-3 [&_.swiper-pagination]:!text-left [&_.swiper-pagination]:!left-4 [&_.swiper-pagination]:!w-auto [&_.swiper-pagination-bullet]:!bg-gray-400 [&_.swiper-pagination-bullet-active]:!bg-amber-500"
                >
                  {heroBattles.map((b: any) => (
                    <SwiperSlide key={b._id || b.slug}>
                      <Link
                        href={`/battles/${b.slug || b._id}`}
                        className="group relative block w-full h-full"
                        draggable={false}
                      >
                        <img
                          src={b.featuredImage}
                          alt={b.title || b.name || 'Battle archive'}
                          draggable={false}
                          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 pb-9 space-y-1">
                          <span className="text-[10px] text-amber-400 uppercase font-bold">
                            Latest battle {b.year ? `· ${b.year}` : ''}
                          </span>
                          <p className="text-white font-black uppercase text-sm font-sans line-clamp-2">
                            {b.title || b.name}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <dl className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-3 gap-4 md:gap-0 md:divide-x md:divide-gray-800">
            {stats.map((s) => (
              <div key={s.label} className="md:px-8 md:first:pl-0 flex flex-col gap-1">
                <dd className="text-2xl md:text-4xl font-black text-amber-500 font-sans leading-none">
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

      {/* 2. Browse by era */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-4">
          <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">Browse by era</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ERAS.map((era) => (
              <Link
                key={era.slug}
                href={`/battles?era=${era.slug}`}
                className="bg-[#111827] border border-gray-800 rounded-lg p-5 hover:border-amber-500/50 transition-colors"
              >
                <p className="text-white font-black uppercase text-sm font-sans">{era.label}</p>
                <p className="text-xs text-gray-500 mt-1">{era.years}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 3. Latest battles & operations */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>⚡</span> Latest Battles & Operations
            </h2>
            <Link href="/battles" className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase">
              View all maps →
            </Link>
          </div>

          {loadingBattles ? (
            <p className="text-xs text-amber-500 animate-pulse">[ SCANNING BATTLE ARCHIVES... ]</p>
          ) : battles.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={battles.length > 3}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="battles-slider pb-12 pt-2"
            >
              {battles.map((b: any) => {
                const battleLink = `/battles/${b.slug || b._id}`;
                const thumbnail = hasImage(b) ? b.featuredImage : FALLBACK_BATTLE_IMG;
                const cleanDesc = stripHtml(b.summary || b.description || '');

                return (
                  <SwiperSlide key={b._id || b.slug}>
                    <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all h-full">
                      <Link href={battleLink} className="w-full h-40 overflow-hidden bg-black/40 border-b border-gray-800 block">
                        <img
                          src={thumbnail}
                          alt={b.title || b.name || 'Battle Archive'}
                          loading="lazy"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                              {b.theater || 'EUROPEAN'}
                            </span>
                            <span className="text-gray-400 font-bold">{b.year || 'N/A'}</span>
                          </div>
                          <h3 className="text-base font-black text-white uppercase line-clamp-2">
                            <Link href={battleLink} className="hover:text-amber-500 transition-colors">
                              {b.title || b.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 font-sans">
                            {cleanDesc || 'Tactical overview of engagement parameters...'}
                          </p>
                        </div>
                        <Link
                          href={battleLink}
                          className="inline-block text-xs font-bold text-amber-500 hover:underline pt-2 border-t border-gray-800/60"
                        >
                          Access Briefing File →
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p className="text-xs text-gray-500">No battle records found in archives.</p>
          )}
        </section>
      </div>

      {/* 4. Defense news wire */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6 bg-[#111827]/70 border border-gray-800 p-6 md:p-8 rounded-xl shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>📡</span> Defense Intelligence & News Wire
            </h2>
            <Link href="/news" className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase">
              All dispatches →
            </Link>
          </div>

          {loadingNews ? (
            <p className="text-xs text-amber-500 animate-pulse">[ RECEIVING DEFENSE WIRE FEEDS... ]</p>
          ) : defenseNewsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defenseNewsItems.slice(0, 4).map((news: any, i: number) => {
                const newsLink = `/news/${news.slug || news._id}`;
                const cleanNewsSummary = stripHtml(news.summary || news.description || '');
                return (
                  <div
                    key={news._id || news.slug || i}
                    className="bg-black/50 border border-gray-800/80 p-5 rounded-lg hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                          {news.category || 'DEFENSE TECH'}
                        </span>
                        <span className="text-gray-500">{news.source || 'Intelligence Wire'}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-black text-white hover:text-amber-500 transition-colors uppercase font-sans">
                        <Link href={newsLink}>{news.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">
                        {cleanNewsSummary}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-900 flex justify-end">
                      <Link href={newsLink} className="text-[11px] font-bold text-amber-500 hover:underline">
                        Read Wire Report →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500">[ NO DEFENSE NEWS DISPATCHES AVAILABLE ]</p>
          )}
        </section>
      </div>

      {/* 5. Field reports & articles */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6 bg-[#0b1220] border border-gray-800 p-6 md:p-8 rounded-xl shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>📖</span> Field Reports & Articles
            </h2>
            <Link href="/articles" className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase">
              All articles →
            </Link>
          </div>

          {loadingArticles ? (
            <p className="text-xs text-amber-500 animate-pulse py-8 text-center">[ LOADING CLASSIFIED ARCHIVES... ]</p>
          ) : articles.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={articles.length > 2}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              breakpoints={{ 768: { slidesPerView: 2 } }}
              className="articles-slider pb-12 pt-2 px-10"
            >
              {articles.map((article: any) => {
                const articleLink = `/articles/${article.slug || article._id}`;
                const image = article.image || article.featuredImage || FALLBACK_ARTICLE_IMG;
                const categoryName =
                  typeof article.category === 'object' && article.category !== null
                    ? article.category.name
                    : article.category || 'WWII / DOCTRINE';
                const cleanArticleSummary = stripHtml(article.summary || article.description || '');

                return (
                  <SwiperSlide key={article._id || article.slug}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#111827] p-5 rounded-lg border border-gray-800 hover:border-amber-500/50 transition-all h-full">
                      <Link href={articleLink} className="w-full sm:w-36 h-28 shrink-0 block overflow-hidden rounded bg-black/40">
                        <img
                          src={image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="space-y-2 flex-1">
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase font-bold inline-block">
                          {categoryName}
                        </span>
                        <h3 className="text-base font-black text-white font-sans line-clamp-2 leading-snug">
                          <Link href={articleLink} className="hover:text-amber-500 transition-colors">
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
                          {cleanArticleSummary || 'Tactical research dossier analysis...'}
                        </p>
                        <Link href={articleLink} className="inline-block text-[11px] font-bold text-amber-500 hover:underline pt-1">
                          Read Analysis →
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p className="text-xs text-gray-500 py-4 text-center">No articles found in archive.</p>
          )}
        </section>
      </div>

      {/* 6. About + YouTube + Facebook Community 60k+ */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 md:p-8 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">About Battle Theory</h2>
              <p className="text-gray-300 text-sm font-sans leading-relaxed">
                Battle Theory tells stories from military history, with a focus on World War II: legendary battles,
                forgotten heroes, military technology, secret missions, and the commanders and strategies that shaped them.
              </p>
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 md:p-8 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">Watch on YouTube</h2>
              <p className="text-gray-300 text-sm font-sans leading-relaxed">
                The same battles in video form. New briefings are posted on the Battle Theory channel.
              </p>
            </div>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-3 rounded text-xs uppercase tracking-widest transition-all"
            >
              Open channel →
            </a>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 md:p-8 space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase">Facebook Community</h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                  60K+ FOLLOWERS
                </span>
              </div>
              <p className="text-gray-300 text-sm font-sans leading-relaxed">
                Join our active community of military history enthusiasts, veterans, and researchers for daily tactical briefings.
              </p>
            </div>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
            >
              Join Community →
            </a>
          </div>
        </section>
      </div>

      {/* 7. Newsletter */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#111827] to-amber-950/40 p-8 md:p-10 text-center space-y-4 shadow-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
            [ WEEKLY TACTICAL DISPATCH ]
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
            Subscribe to Military History Briefings
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto font-sans">
            Receive exclusive tactical analyses, newly unclassified battle maps, and deep-dive weapon doctrine
            reviews directly in your inbox.
          </p>

          {subscribed ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded max-w-md mx-auto">
              ✓ You have been added to the dispatch list.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black/60 border border-gray-700 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-2.5 rounded text-xs uppercase tracking-widest transition-all"
              >
                Subscribe
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
