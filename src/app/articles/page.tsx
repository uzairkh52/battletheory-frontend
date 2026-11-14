import type { Metadata } from 'next';
import ArticlesClient from '@/components/website/ArticlesClient';
import { getApiBaseUrl } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Tactical Articles Archive',
  description:
    'Declassified military history briefings: battles, commanders, weapons and doctrine, researched and explained.',
  alternates: { canonical: '/articles' },
};

async function getArticles(): Promise<{ articles: any[]; failed: boolean }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/articles`, { next: { revalidate: 60 } });
    if (!res.ok) return { articles: [], failed: true };
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.articles || json?.data || [];
    return { articles: Array.isArray(list) ? list : [], failed: false };
  } catch (e) {
    console.error('Error fetching articles server-side:', e);
    return { articles: [], failed: true };
  }
}

export default async function ArticlesPage() {
  const { articles, failed } = await getArticles();
  return <ArticlesClient initialArticles={articles} initialFailed={failed} />;
}