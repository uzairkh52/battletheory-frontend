export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  CATEGORIES: {
    LIST: '/categories',
    ARTICLES: '/categories/articles',
    BATTLES: '/categories/battles',
  },
  BATTLES: {
    LIST: '/battles',
    DETAIL: (idOrSlug: string) => `/battles/${idOrSlug}`,
    ADD_COMMENT: (id: string) => `/battles/${id}/comments`,
    CREATE: '/battles',
    DELETE: (id: string) => `/battles/${id}`,
  },
  ARTICLES: {
    LIST: '/articles',
    DETAIL: (idOrSlug: string) => `/articles/${idOrSlug}`,
    ADD_COMMENT: (slug: string) => `/articles/${slug}/comments`,
    CREATE: '/articles',
    DELETE: (id: string | number) => `/articles/${id}`,
  },
  NEWS: {
    // 🌟 Express backend `/api/news` ko point karne ke liye prefix add kar diya gaya hai
    LIST: '/api/news',
    DETAIL: (id: string) => `/api/news/${id}`,
    CREATE: '/api/news',
    UPDATE: (id: string) => `/api/news/${id}`,
    DELETE: (id: string) => `/api/news/${id}`,
  },
  SEARCH: '/search',
  CONTACT: '/contact',
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;