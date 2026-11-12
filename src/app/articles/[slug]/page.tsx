import type { Metadata } from 'next';
import ArticleDetailClient from '@/components/website/ArticleDetailClient';
import styles from "@/styles/component/article/ArticleDetail.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://battletheory.net/api';
const SITE_URL = 'https://battletheory.net';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/articles/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      return json?.article || json?.data || json;
    }
  } catch (error) {
    console.error('Error fetching article:', error);
  }
  return null;
}

// Helper function to ensure absolute image URL for Social Crawlers
function getAbsoluteImageUrl(article: any): string {
  const rawImg = article?.featuredImage || article?.imageUrl || article?.image;
  
  if (!rawImg || typeof rawImg !== 'string' || rawImg.trim() === '') {
    return `${SITE_URL}/og-image.jpg`;
  }

  if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
    return rawImg;
  }

  if (rawImg.startsWith('/')) {
    return `${SITE_URL}${rawImg}`;
  }

  return `${SITE_URL}/${rawImg}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const article = slug ? await getArticle(slug) : null;
  const articleUrl = `${SITE_URL}/articles/${slug || ''}`;

  if (article && article.title) {
    const title = article.title;
    const description = ""; // Description blank taake social preview mein show na ho
    const imageUrl = getAbsoluteImageUrl(article);

    return {
      title: title, // <--- Yahan sirf title dein, layout template khud "| Battle Theory" jor dega
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
    title: 'Strategic Briefing Dossier',
    description: '',
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const initialArticle = slug ? await getArticle(slug) : null;
  const articleImageUrl = getAbsoluteImageUrl(initialArticle);

  // Google Rich Snippets / Discover ranking ke liye JSON-LD Schema
  const jsonLd = initialArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: initialArticle.title,
        description: initialArticle.summary || initialArticle.content?.replace(/<[^>]*>/g, '').slice(0, 160),
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
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/articles/${slug}`,
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