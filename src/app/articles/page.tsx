import type { Metadata } from 'next';
import ArticlesListClient from '@/components/website/ArticlesListClient';

export const metadata: Metadata = {
  title: 'Military Theory & Analysis Articles',
  description: 'In-depth military history essays, weapon breakdown, and strategic research briefs.',
  openGraph: {
    title: 'Military Theory & Analysis Articles | Battle Theory',
    description: 'Explore tactical research essays and declassified military intelligence logs.',
    url: '/articles',
  },
};

export default function ArticlesPage() {
  return <ArticlesListClient />;
}