import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { getApiBaseUrl } from '@/utils/getApiBaseUrl';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // 1. Pehle Redux Auth state se token check karein
      const reduxToken = (getState() as RootState).auth?.token;
      
      // 2. Fallback to localStorage if not found in Redux state (SSR-safe check)
      const storageToken =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const token = reduxToken || storageToken;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Clean Cache Management Keys
  tagTypes: ['Article', 'Battle', 'News', 'User', 'Bookmark'],
  endpoints: () => ({}),
});