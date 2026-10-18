import type { Metadata } from 'next';
import ArticleDetailClient from '@/components/website/ArticleDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/articles/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const article = await res.json();
      const title = article.title || 'Strategic Research Briefing';

      // Dynamic Description Logic: HTML tags strip karke text extract karna
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
  } catch (error) {
    console.error('Error fetching article metadata:', error);
  }

  return {
    title: 'Strategic Briefing Dossier | Battle Theory',
    description: 'Declassified tactical essays, weapon systems breakdowns, and strategic research logs.',
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}