import type { Metadata } from 'next';
import BattleDetailClient from '@/components/website/BattleDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/battles/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const battle = await res.json();
      const title = battle.title || battle.name || 'Classified Battle Engagement';
      const description =
        battle.description?.slice(0, 160) ||
        `Declassified military battle archives for ${title}.`;

      return {
        title: `${title} (${battle.year || 'Historical'}) | Battle Theory`,
        description,
        openGraph: {
          title: `${title} | Battle Theory`,
          description,
          images: battle.featuredImage ? [battle.featuredImage] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching battle metadata:', error);
  }

  return {
    title: 'Declassified Battle Briefing | Battle Theory',
    description: 'Explore tactical engagement briefings and geospatial maps.',
  };
}

export default async function BattleDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BattleDetailClient slug={slug} />;
}