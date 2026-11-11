import { MetadataRoute } from 'next';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const BASE_URL = 'https://battletheory.net';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://battletheory.net/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const fetchDynamicRoutes = async (
    endpoint: string,
    routePrefix: string
  ): Promise<MetadataRoute.Sitemap> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return [];

      const data = await res.json();
      
      // Handle all possible API response structures based on screenshots
      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        items = data.battles || data.articles || data.news || data.data || data.results || [];
      }

      return items.map((item: any) => {
        let slug = item.slug || item._id || item.id;
        
        // News ya items jinme slug na ho, unke liye title-based slug fallback
        if (routePrefix === '/news' && item.title && !item.slug) {
          slug = item.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/['"]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        }

        return {
          url: `${BASE_URL}${routePrefix}/${slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt || Date.now()).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
    } catch (error) {
      console.error(`Error fetching sitemap for ${routePrefix}:`, error);
      return [];
    }
  };

  const [articleRoutes, battleRoutes, newsRoutes] = await Promise.all([
    fetchDynamicRoutes(API_ENDPOINTS.ARTICLES.LIST, '/articles'),
    fetchDynamicRoutes(API_ENDPOINTS.BATTLES.LIST, '/battles'),
    fetchDynamicRoutes(API_ENDPOINTS.NEWS.LIST, '/news'),
  ]);

  return [...staticRoutes, ...articleRoutes, ...battleRoutes, ...newsRoutes];
}