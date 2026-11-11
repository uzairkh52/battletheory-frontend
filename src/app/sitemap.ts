import { MetadataRoute } from 'next';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const BASE_URL = 'https://battletheory.net';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static base pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/battles',
    '/articles',
    '/news',
    '/bookmarks',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Helper function: API se items safely fetch karke dynamic URLs banana
  const fetchDynamicRoutes = async (
    endpoint: string,
    routePrefix: string
  ): Promise<MetadataRoute.Sitemap> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        next: { revalidate: 3600 }, // Har 1 ghante baad auto-refresh
      });
      if (!res.ok) return [];

      const data = await res.json();
      const items = Array.isArray(data) ? data : data.articles || data.news || data.battles || data.data || [];

      return items.map((item: any) => ({
        url: `${BASE_URL}${routePrefix}/${item.slug || item._id || item.id}`,
        lastModified: new Date(item.updatedAt || item.createdAt || Date.now()).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error(`Error fetching sitemap for ${routePrefix}:`, error);
      return [];
    }
  };

  // 2. Parallel API calls (Articles, Battles, News)
  const [articleRoutes, battleRoutes, newsRoutes] = await Promise.all([
    fetchDynamicRoutes(API_ENDPOINTS.ARTICLES.LIST, '/articles'),
    fetchDynamicRoutes(API_ENDPOINTS.BATTLES.LIST, '/battles'),
    fetchDynamicRoutes(API_ENDPOINTS.NEWS.LIST, '/news'),
  ]);

  return [...staticRoutes, ...articleRoutes, ...battleRoutes, ...newsRoutes];
}