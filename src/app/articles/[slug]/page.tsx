import type { Metadata } from 'next';
import ArticleDetailClient from '@/components/website/ArticleDetailClient';
import styles from "@/styles/component/article/ArticleDetail.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/articles/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error fetching article:', error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  const articleUrl = `https://battletheory.net/articles/${slug}`;

  if (article) {
    const title = article.title || 'Strategic Research Briefing';
    const cleanContent = article.content ? article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
    const rawDescription = article.summary?.trim() || cleanContent;
    const description = rawDescription
      ? rawDescription.slice(0, 157).trim() + (rawDescription.length > 157 ? '...' : '')
      : `Declassified tactical research essay on ${title} by Battle Theory.`;
    const imageUrl = article.featuredImage || article.imageUrl || article.image || 'https://battletheory.net/og-default.jpg';

    return {
      title: `${title} | Battle Theory`,
      description,
      alternates: {
        canonical: articleUrl,
      },
      openGraph: {
        title: `${title} | Battle Theory`,
        description,
        url: articleUrl,
        siteName: 'Battle Theory',
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt || article.createdAt,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
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
    title: 'Strategic Briefing Dossier | Battle Theory',
    description: 'Declassified tactical essays, weapon systems breakdowns, and strategic research logs.',
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const initialArticle = await getArticle(slug);

  // Google Rich Snippets / Discover ranking ke liye JSON-LD Schema
  const jsonLd = initialArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: initialArticle.title,
        description: initialArticle.summary || initialArticle.content?.replace(/<[^>]*>/g, '').slice(0, 160),
        image: [
          initialArticle.featuredImage ||
          initialArticle.imageUrl ||
          initialArticle.image ||
          'https://battletheory.net/og-default.jpg',
        ],
        datePublished: initialArticle.createdAt,
        dateModified: initialArticle.updatedAt || initialArticle.createdAt,
        author: {
          '@type': 'Person',
          name: initialArticle.authorName || 'Muhammad Uzair',
          url: 'https://battletheory.net',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Battle Theory',
          url: 'https://battletheory.net',
          logo: {
            '@type': 'ImageObject',
            url: 'https://battletheory.net/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://battletheory.net/articles/${slug}`,
        },
      }
    : null;

  return (
    <div className={styles.articleContainer}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleDetailClient slug={slug} initialArticle={initialArticle} />
    </div>
  );
}