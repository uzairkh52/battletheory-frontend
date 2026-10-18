import type { Metadata } from 'next';
import BattlesVisualizer from '@/components/website/BattlesVisualizer';

export const metadata: Metadata = {
  title: 'Historic Battles Archive',
  description: 'Declassified military battle archives, interactive geospatial tactical maps, and force engagement breakdowns.',
  openGraph: {
    title: 'Historic Battles Archive | Battle Theory',
    description: 'Explore tactical battle maps, theater engagement timelines, and historic military briefings.',
    url: '/battles',
  },
};

export default function BattlesPage() {
  return <BattlesVisualizer />;
}