import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import battleReducer from './slices/battleSlice';
import articleReducer from './slices/articleSlice';
import newsReducer from './slices/newsSlice';
import searchReducer from './slices/searchSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import baseReducer from './slices/baseSlice'; // 🌟 1. Import base slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    battles: battleReducer,
    articles: articleReducer,
    news: newsReducer,
    search: searchReducer,
    bookmarks: bookmarkReducer,
    base: baseReducer, // 🌟 2. Register base slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;