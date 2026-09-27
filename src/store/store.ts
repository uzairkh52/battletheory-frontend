import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import battleReducer from './slices/battleSlice';
import articleReducer from './slices/articleSlice';
import newsReducer from './slices/newsSlice'; // Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    battles: battleReducer,
    articles: articleReducer,
    news: newsReducer, // Add Reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;