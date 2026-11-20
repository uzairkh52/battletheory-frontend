import type { Metadata } from 'next';
import NewsDetailClient from '@/components/website/NewsDetailClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.battletheory.net/api';

async function getNewsBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/news/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.news || data?.data || data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  const siteName = 'BattleTheory';
  const defaultTitle = 'BattleTheory | High-Performance Military Intelligence';
  const defaultDescription =
    'In-depth military history, defense briefings, naval and aerial campaigns, and strategic intelligence analysis from BattleTheory.';
  const defaultImage = 'https://i.postimg.cc/FsJRPMys/web-logo.png';

  if (!news) {
    return {
      title: { absolute: defaultTitle },
      description: defaultDescription,
      openGraph: {
        type: 'website',
        siteName,
        title: defaultTitle,
        description: defaultDescription,
        url: `https://www.battletheory.net/news/${slug}`,
        images: [{ url: defaultImage, width: 1200, height: 630, alt: siteName }],
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDescription,
        images: [defaultImage],
      },
    };
  }

  const cleanTitle = news.title ? String(news.title).trim() : '';
  const ogTitle = cleanTitle ? `${cleanTitle} | ${siteName}` : defaultTitle;

  const cleanSummary = String(news.summary || news.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const description =
    cleanSummary.length >= 100
      ? cleanSummary
      : `${cleanSummary ? `${cleanSummary} — ` : ''}${defaultDescription}`;

  const rawImage =
    news.image ||
    news.imageUrl ||
    news.featuredImage ||
    news.thumbnail ||
    defaultImage;

  const imageUrl =
    typeof rawImage === 'string' && rawImage.trim().startsWith('http')
      ? rawImage.trim()
      : defaultImage;

  return {
    title: cleanTitle || { absolute: defaultTitle },
    description,
    openGraph: {
      type: 'article',
      siteName,
      title: ogTitle,
      description,
      url: `https://www.battletheory.net/news/${slug}`,
      publishedTime: news.publishedAt || news.createdAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.imageAlt || cleanTitle || siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function NewsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialNews = await getNewsBySlug(slug);
  return <NewsDetailClient slugProp={slug} initialNews={initialNews} />;
}