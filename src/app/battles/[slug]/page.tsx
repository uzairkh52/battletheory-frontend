import type { Metadata } from 'next';
import BattleDetailClient from '@/components/website/BattleDetailClient';
import { getApiBaseUrl } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${getApiBaseUrl()}/battles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const battle = await res.json();
      const title = battle.title || battle.name || 'Classified Battle Engagement';

      const metaDescription =
        battle.summary ||
        battle.description?.slice(0, 160) ||
        `Declassified military battle archives for ${title}.`;

      return {
        title: `${title} (${battle.year || 'Historical'}) | Battle Theory`,
        description: metaDescription,
        openGraph: {
          title: `${title} | Battle Theory`,
          description: metaDescription,
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