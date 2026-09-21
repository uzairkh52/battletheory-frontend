// src/store/services/battleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Battle } from '@/types';
import { RootState } from '../store';

export type CreateBattleInput = Omit<Battle, '_id' | 'createdAt' | 'updatedAt'>;

export const battleApi = createApi({
  reducerPath: 'battleApi',
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
  tagTypes: ['Battle'], // <-- Yahan 'Battle' tag defined hai
  endpoints: (builder) => ({
    getBattles: builder.query<Battle[], void>({
      query: () => '/battles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Battle' as const, id: _id })),
              { type: 'Battle', id: 'LIST' },
            ]
          : [{ type: 'Battle', id: 'LIST' }],
    }),

    getBattleById: builder.query<Battle, string>({
      query: (id) => `/battles/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Battle', id }],
    }),

    createBattle: builder.mutation<Battle, CreateBattleInput>({
      query: (body) => ({
        url: '/battles',
        method: 'POST',
        body,
      }),
      // FIX: 'Article' ki jagah 'Battle' tag invalidates karein
      invalidatesTags: [{ type: 'Battle', id: 'LIST' }], 
    }),

    deleteBattle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/battles/${id}`,
        method: 'DELETE',
      }),
      // FIX: 'Article' ki jagah 'Battle' tag invalidates karein
      invalidatesTags: (_res, _err, id) => [
        { type: 'Battle', id },
        { type: 'Battle', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBattlesQuery,
  useGetBattleByIdQuery,
  useCreateBattleMutation,
  useDeleteBattleMutation,
} = battleApi;