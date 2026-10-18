import type { Metadata } from 'next';
import NewsDetailClient from '@/components/website/NewsDetailClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

type Props = {
  params: Promise<{ slug: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}${API_ENDPOINTS.NEWS.DETAIL(slug)}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const newsItem = await res.json();
      const title = newsItem.title || 'Defense Intelligence Alert';
      const description =
        newsItem.summary?.slice(0, 160) ||
        `Automated intelligence tracking for ${title}.`;
      const imageUrl = newsItem.image || newsItem.imageUrl || newsItem.thumbnail;

      return {
        title: `${title} | Battle Theory`,
        description,
        openGraph: {
          title: `${title} | Battle Theory`,
          description,
          images: imageUrl ? [imageUrl] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching news metadata:', error);
  }

  return {
    title: 'Defense Intelligence Alert | Battle Theory',
    description: 'Real-time automated defense intelligence tracking.',
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  return <NewsDetailClient slug={slug} />;
}