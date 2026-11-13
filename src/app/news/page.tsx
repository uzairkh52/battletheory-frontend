import type { Metadata } from 'next';
import NewsFeedClient from '@/components/website/NewsFeedClient';

export const metadata: Metadata = {
  title: 'Defense Intelligence & Military Tech News',
  description:
    'Real-time automated defense intelligence alerts, military AI integration, and autonomous security technologies.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'Defense & Strategic Intelligence Alerts | Battle Theory',
    description:
      'Real-time tracking of military technology, autonomous systems, and strategic global security updates.',
    url: '/news',
    type: 'website',
  },
};

const PAGE_SIZE = 20;

function getApiUrl() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ||
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://battletheory.net'}/api`;
  return `${raw.replace(/\/+$/, '').replace(/\/api$/, '')}/api`;
}

// Pehla page server par: HTML mein content aata hai (SEO + fast first paint), 60s ISR cache
async function getInitialNews(): Promise<{ news: any[]; hasMore: boolean; failed: boolean }> {
  try {
    const res = await fetch(`${getApiUrl()}/news?page=1&limit=${PAGE_SIZE}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { news: [], hasMore: false, failed: true };
    const data = await res.json();
    const news = Array.isArray(data) ? data : data?.news || data?.items || [];
    const hasMore =
      data && !Array.isArray(data) && data.hasMore !== undefined
        ? Boolean(data.hasMore)
        : news.length === PAGE_SIZE;
    return { news, hasMore, failed: false };
  } catch (e) {
    console.error('Error fetching news server-side:', e);
    return { news: [], hasMore: false, failed: true };
  }
}

export default async function NewsPage() {
  const { news, hasMore, failed } = await getInitialNews();
  return <NewsFeedClient initialNews={news} initialHasMore={hasMore} initialFailed={failed} />;
}
