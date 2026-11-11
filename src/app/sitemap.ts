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

  try {
    console.log('Fetching from API_BASE:', API_BASE);
    
    // Let's fetch them one by one with explicit error logging
    let battles: any[] = [];
    let articles: any[] = [];
    let news: any[] = [];

    try {
      const res = await fetch(`${API_BASE}${API_ENDPOINTS.BATTLES.LIST}`, { cache: 'no-store' });
      const json = await res.json();
      battles = Array.isArray(json) ? json : json.battles || json.data || [];
    } catch (e) {
      console.error('Battle fetch error:', e);
    }

    try {
      const res = await fetch(`${API_BASE}${API_ENDPOINTS.ARTICLES.LIST}`, { cache: 'no-store' });
      const json = await res.json();
      articles = Array.isArray(json) ? json : json.articles || json.data || [];
    } catch (e) {
      console.error('Article fetch error:', e);
    }

    try {
      const res = await fetch(`${API_BASE}${API_ENDPOINTS.NEWS.LIST}`, { cache: 'no-store' });
      const json = await res.json();
      news = Array.isArray(json) ? json : json.news || json.data || [];
    } catch (e) {
      console.error('News fetch error:', e);
    }

    const battleRoutes: MetadataRoute.Sitemap = battles.map((item: any) => ({
      url: `${BASE_URL}/battles/${item.slug || item._id}`,
      lastModified: new Date(item.updatedAt || Date.now()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((item: any) => ({
      url: `${BASE_URL}/articles/${item.slug || item._id}`,
      lastModified: new Date(item.updatedAt || Date.now()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const newsRoutes: MetadataRoute.Sitemap = news.map((item: any) => {
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

    return [...staticRoutes, ...battleRoutes, ...articleRoutes, ...newsRoutes];
  } catch (error) {
    console.error('Critical Sitemap Error:', error);
    return staticRoutes;
  }
}