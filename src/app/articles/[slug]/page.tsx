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

  if (article) {
    const title = article.title || 'Strategic Research Briefing';
    const cleanContent = article.content ? article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
    const rawDescription = article.summary?.trim() || cleanContent;
    const description = rawDescription
      ? rawDescription.slice(0, 157).trim() + (rawDescription.length > 157 ? '...' : '')
      : `Declassified tactical research essay on ${title} by Battle Theory.`;
    const imageUrl = article.featuredImage || article.imageUrl || article.image;

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

  return {
    title: 'Strategic Briefing Dossier | Battle Theory',
    description: 'Declassified tactical essays, weapon systems breakdowns, and strategic research logs.',
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const initialArticle = await getArticle(slug);

  return (
    <div className={styles.articleContainer}>
      <ArticleDetailClient slug={slug} initialArticle={initialArticle} />
    </div>
  );
}