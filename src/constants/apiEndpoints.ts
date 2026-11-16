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
    LIST: '/news',
    DETAIL: (idOrSlug: string) => `/news/${idOrSlug}`,
    CREATE: '/news',
    UPDATE: (id: string) => `/news/${id}`,
    DELETE: (id: string) => `/news/${id}`,
  },
  SEARCH: '/search',
  CONTACT: '/contact',
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;