import ArticlesListClient from '@/components/website/ArticlesListClient';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return <ArticlesListClient filterTag={decodedTag} />;
}