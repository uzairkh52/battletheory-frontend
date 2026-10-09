'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllArticles } from '@/store/slices/articleSlice';
import { fetchNewsList } from '@/store/slices/newsSlice';
import { fetchAllBattles } from '@/store/slices/battleSlice';

// Swiper React components & modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Separate SCSS file import
import '@/styles/slider.scss';

export default function Home() {
  const dispatch = useAppDispatch();

  // Redux States
  const { articles, loading: loadingArticles } = useAppSelector((state) => state.articles);
  const { items: defenseNewsItems, loading: loadingNews } = useAppSelector((state) => state.news);
  const { battles, loading: loadingBattles } = useAppSelector((state) => state.battles);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fetch Battles, Articles & News via Redux on mount
  useEffect(() => {
    dispatch(fetchAllBattles());
    dispatch(fetchAllArticles());
    dispatch(fetchNewsList());
  }, [dispatch]);

  const reviews = [
    {
      author: '@Commander_Vance',
      time: '2 hrs ago',
      text: 'The tactical breakdown of the Pacific theater logistics completely shifts how we evaluate island hopping campaigns.',
    },
    {
      author: '@PantherAce99',
      time: 'Yesterday',
      text: 'Incredible archive mapping! The geospatial coordinates on the Kursk sector match the primary logs accurately.',
    },
    {
      author: '@TacticalHistorian',
      time: '3 days ago',
      text: 'The featured image integration and phase breakdowns make these historical briefings look like a professional defense briefing.',
    },
    {
      author: '@GeneralStalingrad',
      time: '4 days ago',
      text: 'Brilliant strategic depth. The analysis of armored columns during the winter counter-offensive is spot on.',
    },
    {
      author: '@NavalObserver',
      time: '5 days ago',
      text: 'The carrier task force tactical movements and radar logs are mapped out with incredible precision.',
    },
    {
      author: '@AirMarshal_Max',
      time: '1 week ago',
      text: 'Essential archive for anyone studying air superiority doctrine and sector control mechanisms.',
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-14 py-6 font-mono w-full">
      
      {/* 1. Hero Section Container */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative rounded-xl border border-amber-500/20 bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
              [ TACTICAL OPERATIONS ARCHIVE v2.6 ]
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              DEEP-DIVE MILITARY HISTORY & TACTICAL ANALYSIS
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
              Unraveling pivotal battles, war doctrines, and high-performance military innovations with high-precision historical breakdowns and interactive geospatial intelligence maps.
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
        </section>
      </div>

      {/* 2. Latest Battle Engagements Container (Dynamic via battleSlice) */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>⚡</span> Latest Strategic Battle Engagements
            </h2>
            <Link href="/battles" className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase">
              View All Map Archive →
            </Link>
          </div>

          {loadingBattles ? (
            <p className="text-xs text-amber-500 animate-pulse">[ SCANNING BATTLE ARCHIVES... ]</p>
          ) : battles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {battles.slice(0, 3).map((b) => {
                const battleLink = `/battles/${b.slug || b._id}`;
                const thumbnail = (b.featuredImage && typeof b.featuredImage === 'string' && b.featuredImage.trim() !== '') 
                  ? b.featuredImage 
                  : 'https://images.unsplash.com/photo-1579965101323-8832a84a6b57?w=600&auto=format&fit=crop&q=60';
                
                return (
                  <div
                    key={b._id}
                    className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all"
                  >
                    <Link href={battleLink} className="w-full h-40 overflow-hidden bg-black/40 border-b border-gray-800 block">
                      <img
                        src={thumbnail}
                        alt={b.title || b.name || 'Battle Archive'}
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
                        <h3 className="text-base font-black text-white uppercase truncate">
                          <Link href={battleLink} className="hover:text-amber-500 transition-colors">
                            {b.title || b.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 font-sans">
                          {b.description || b.summary || 'Tactical overview of engagement parameters...'}
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
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No battle records found in archives.</p>
          )}
        </section>
      </div>

      {/* 3. Defense Intelligence & News Wire (Dynamic via newsSlice) */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6 bg-[#111827]/70 border border-gray-800 p-6 md:p-8 rounded-xl shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>📡</span> Defense Intelligence & News Wire
            </h2>
            <Link href="/news" className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase">
              All Dispatches →
            </Link>
          </div>

          {loadingNews ? (
            <p className="text-xs text-amber-500 animate-pulse">[ RECEIVING DEFENSE WIRE FEEDS... ]</p>
          ) : defenseNewsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defenseNewsItems.slice(0, 4).map((news) => {
                const newsLink = `/news/${news.slug || news._id}`;
                return (
                  <div 
                    key={news._id || news.slug} 
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
                        {news.summary}
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
            <p className="text-xs text-gray-500">No defense news dispatches available.</p>
          )}
        </section>
      </div>

      {/* 4. Classified Field Reports & Articles (Dynamic via articleSlice) */}
      <section className="w-full bg-white text-gray-900 py-12 px-6 md:px-16 shadow-2xl my-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-gray-300 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-700 uppercase flex items-center gap-2">
              <span>📖</span> Classified Field Reports & Articles
            </h2>
            <Link href="/articles" className="text-xs text-gray-600 hover:text-amber-700 transition-colors uppercase font-bold">
              All Articles →
            </Link>
          </div>

          {loadingArticles ? (
            <p className="text-xs text-amber-700 animate-pulse py-8 text-center">[ LOADING CLASSIFIED ARCHIVES... ]</p>
          ) : articles.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              breakpoints={{
                768: { slidesPerView: 2 },
              }}
              className="articles-slider pb-12 pt-2 px-6"
            >
              {articles.map((article) => {
                const articleLink = `/articles/${article.slug}`;
                const image = (article as any).image || (article as any).featuredImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60';
                
                const categoryName = typeof article.category === 'object' && article.category !== null 
                  ? (article.category as any).name 
                  : article.category || 'WWII / DOCTRINE';

                return (
                  <SwiperSlide key={article._id || article.slug}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
                      <Link href={articleLink} className="w-full sm:w-36 h-28 shrink-0 block overflow-hidden rounded">
                        <img
                          src={image}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="space-y-2 flex-1">
                        <span className="text-[9px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase font-bold">
                          {categoryName}
                        </span>
                        <h3 className="text-base font-black text-gray-900 uppercase">
                          <Link href={articleLink} className="hover:text-amber-700 transition-colors">
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-700 font-sans line-clamp-2">
                          {article.summary}
                        </p>
                        <Link href={articleLink} className="inline-block text-[11px] font-bold text-amber-700 hover:underline pt-1">
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
        </div>
      </section>

      {/* 5. Command Feed Container */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="space-y-6 bg-black/40 border border-gray-800/80 p-6 rounded-xl relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
              <span>🎙</span> Command Feed & Historian Debriefs
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            className="pb-12 pt-2 px-10"
          >
            {reviews.map((review, idx) => (
              <SwiperSlide key={idx} className="flex justify-center">
                <div className="bg-[#111827] p-6 rounded-lg border border-gray-800 space-y-2 w-full max-w-2xl mx-auto shadow-2xl">
                  <div className="flex justify-between text-gray-500 font-mono text-[10px]">
                    <span className="text-amber-500 font-bold">{review.author}</span>
                    <span>{review.time}</span>
                  </div>
                  <p className="text-gray-300 italic text-sm font-sans">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* 6. Newsletter Section Container */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#111827] to-amber-950/40 p-8 md:p-10 text-center space-y-4 shadow-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
            [ WEEKLY TACTICAL DISPATCH ]
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
            Subscribe to Military History Briefings
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto font-sans">
            Receive exclusive tactical analyses, newly unclassified battle maps, and deep-dive weapon doctrine reviews directly in your inbox.
          </p>

          {subscribed ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded max-w-md mx-auto">
              ✓ SUCCESS: You have been successfully enlisted in the dispatch roster.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your operational email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black/60 border border-gray-700 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-2.5 rounded text-xs uppercase tracking-widest transition-all"
              >
                Enlist Now
              </button>
            </form>
          )}
        </section>
      </div>

    </div>
  );
}