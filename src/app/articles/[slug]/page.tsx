import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ArticleDetailClient from '@/components/website/ArticleDetailClient';
import styles from "@/styles/component/article/ArticleDetail.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://battletheory.net';

// React cache(): metadata aur page dono mein ek hi request chalegi
const getArticle = cache(async (slug: string) => {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || `${SITE_URL}/api`;
    baseUrl = baseUrl.replace(/\/+$/, '');
    if (!baseUrl.endsWith('/api')) baseUrl = `${baseUrl}/api`;

    const res = await fetch(`${baseUrl}/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }, // 'no-store' ki jagah ISR
    });

    if (res.ok) {
      const json = await res.json();
      return json?.article || json?.data || json;
    }
    console.error(`API failed ${res.status} for ${baseUrl}/articles/${slug}`);
  } catch (error) {
    console.error('Error fetching article server-side:', error);
  }
  return null;
});

function getAbsoluteImageUrl(article: any): string {
  const rawImg = article?.featuredImage || article?.imageUrl || article?.image;

  if (!rawImg || typeof rawImg !== 'string' || rawImg.trim() === '') {
    return `${SITE_URL}/og-image.jpg`;
  }
  if (/^https?:\/\//.test(rawImg)) return rawImg;
  return rawImg.startsWith('/') ? `${SITE_URL}${rawImg}` : `${SITE_URL}/${rawImg}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = slug ? await getArticle(slug) : null;
  const articleUrl = `${SITE_URL}/articles/${slug || ''}`;

  if (article?.title) {
    const title = article.title;
    const description =
      article.summary ||
      article.excerpt ||
      'Read the full declassified tactical briefing and military history analysis on Battle Theory.';
    const imageUrl = getAbsoluteImageUrl(article);

    return {
      title,
      description,
      alternates: { canonical: articleUrl },
      openGraph: {
        title: `${title} | Battle Theory`,
        description,
        url: articleUrl,
        siteName: 'Battle Theory',
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt || article.createdAt,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Battle Theory`,
        description,
        images: [imageUrl],
      },
    };
  }

  return {
    title: 'Strategic Briefing Dossier',
    description: 'Declassified tactical briefings and military history analysis on Battle Theory.',
    robots: { index: false, follow: false },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const initialArticle = slug ? await getArticle(slug) : null;

  if (!initialArticle) notFound(); // proper 404 status

  const articleImageUrl = getAbsoluteImageUrl(initialArticle);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: initialArticle.title,
    description: initialArticle.summary || 'Military history tactical briefing on Battle Theory.',
    image: [articleImageUrl],
    datePublished: initialArticle.createdAt,
    dateModified: initialArticle.updatedAt || initialArticle.createdAt,
    author: {
      '@type': 'Person',
      name: initialArticle.authorName || 'Muhammad Uzair',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Battle Theory',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${slug}`,
    },
  };

  return (
    <div className={styles.articleContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // '<' escape karna zaroori hai warna </script> injection ho sakti hai
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ArticleDetailClient slug={slug} initialArticle={initialArticle} />
    </div>
  );
}