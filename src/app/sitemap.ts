import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic'; // Force dynamic generation so it fetches fresh data on every request

const BASE_URL = 'https://battletheory.net';
// Direct hardcoded API URL use kar rahe hain taake env variable miss hone ka koi chance na rahe
const API_BASE = 'https://api.battletheory.net/api';

function toSlug(title: string): string {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

async function fetchCollection(endpoint: string, key: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json)) return json;
    return json[key] || json.data || [];
  } catch (error) {
    console.error(`Sitemap ${endpoint} fetch error:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nowIso = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/battles', priority: 0.8, freq: 'daily' as const },
    { path: '/articles', priority: 0.8, freq: 'daily' as const },
    { path: '/news', priority: 0.9, freq: 'hourly' as const },
    { path: '/bookmarks', priority: 0.4, freq: 'weekly' as const },
  ].map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: nowIso,
    changeFrequency: freq,
    priority,
  }));

  try {
    const [battles, articles, news] = await Promise.all([
      fetchCollection('battles', 'battles'),
      fetchCollection('articles', 'articles'),
      fetchCollection('news', 'news'),
    ]);

    const battleUrls: MetadataRoute.Sitemap = battles
      .map((item: any) => {
        const slug = item.slug || (item.title ? toSlug(item.title) : item._id);
        if (!slug) return null;
        return {
          url: `${BASE_URL}/battles/${slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt || Date.now()).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const articleUrls: MetadataRoute.Sitemap = articles
      .map((item: any) => {
        const slug = item.slug || (item.title ? toSlug(item.title) : item._id);
        if (!slug) return null;
        return {
          url: `${BASE_URL}/articles/${slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt || Date.now()).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const newsUrls: MetadataRoute.Sitemap = news
      .map((item: any) => {
        const slug = item.slug || (item.title ? toSlug(item.title) : item._id);
        if (!slug) return null;
        return {
          url: `${BASE_URL}/news/${slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt || Date.now()).toISOString(),
          changeFrequency: 'daily' as const,
          priority: 0.9,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return [...staticRoutes, ...battleUrls, ...articleUrls, ...newsUrls];
  } catch (error) {
    console.error('Sitemap generation critical error:', error);
    return staticRoutes;
  }
}