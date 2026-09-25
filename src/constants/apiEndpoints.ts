export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  CATEGORIES: {
    LIST: '/categories',
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
    ADD_COMMENT: (slug: string) => `/articles/slug/${slug}/comments`,
    CREATE: '/articles',
    DELETE: (id: string | number) => `/articles/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;