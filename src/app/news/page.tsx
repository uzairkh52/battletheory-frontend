import type { Metadata } from 'next';
import NewsFeedClient from '@/components/website/NewsFeedClient';

export const metadata: Metadata = {
  title: 'Defense Intelligence & Military Tech News',
  description:
    'Real-time automated defense intelligence alerts, military AI integration, and autonomous security technologies.',
  openGraph: {
    title: 'Defense & Strategic Intelligence Alerts | Battle Theory',
    description:
      'Real-time tracking of military technology, autonomous systems, and strategic global security updates.',
    url: '/news',
  },
};

export default function NewsPage() {
  return <NewsFeedClient />;
}