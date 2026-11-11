import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic'; // Force dynamic generation so it fetches fresh data on every request

const BASE_URL = 'https://battletheory.net';
// Direct hardcoded API URL use kar rahe hain taake env variable miss hone ka koi chance na rahe
const API_BASE = 'https://api.battletheory.net/api';

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

  try {
    let battles: any[] = [];
    let articles: any[] = [];
    let news: any[] = [];

    // Fetch Battles
    try {
      const res = await fetch(`${API_BASE}/battles`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        battles = Array.isArray(json) ? json : json.battles || json.data || [];
      }
    } catch (e) {
      console.error('Sitemap battle fetch error:', e);
    }

    // Fetch Articles
    try {
      const res = await fetch(`${API_BASE}/articles`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        articles = Array.isArray(json) ? json : json.articles || json.data || [];
      }
    } catch (e) {
      console.error('Sitemap article fetch error:', e);
    }

    // Fetch News
    try {
      const res = await fetch(`${API_BASE}/news`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        news = Array.isArray(json) ? json : json.news || json.data || [];
      }
    } catch (e) {
      console.error('Sitemap news fetch error:', e);
    }

    const battleUrls: MetadataRoute.Sitemap = battles.map((item: any) => ({
      url: `${BASE_URL}/battles/${item.slug || item._id}`,
      lastModified: new Date(item.updatedAt || Date.now()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const articleUrls: MetadataRoute.Sitemap = articles.map((item: any) => ({
      url: `${BASE_URL}/articles/${item.slug || item._id}`,
      lastModified: new Date(item.updatedAt || Date.now()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const newsUrls: MetadataRoute.Sitemap = news.map((item: any) => {
      let slug = item.slug || item._id;
      if (item.title && !item.slug) {
        slug = item.title
          .toString()
          .toLowerCase()
          .trim()
          .replace(/['"]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return {
        url: `${BASE_URL}/news/${slug}`,
        lastModified: new Date(item.updatedAt || Date.now()).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...battleUrls, ...articleUrls, ...newsUrls];
  } catch (error) {
    console.error('Sitemap generation critical error:', error);
    return staticRoutes;
  }
}