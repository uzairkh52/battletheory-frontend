// src/store/services/articleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Article, Category } from '@/types';
import { RootState } from '../store';

// src/store/services/articleApi.ts
export type CreateArticleInput = {
  title: string;
  slug: string; // <-- Added required field
  content: string;
  summary: string;
  category: string;
};

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth?.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Article', 'Category'],
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], void>({
      query: () => '/articles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Article' as const, id: _id })),
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    createArticle: builder.mutation<Article, CreateArticleInput>({
      query: (body) => ({
        url: '/articles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    deleteArticle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Article', id },
        { type: 'Article', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetCategoriesQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;