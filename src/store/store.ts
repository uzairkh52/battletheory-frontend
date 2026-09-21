import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { battleApi } from './services/battleApi';
import { articleApi } from './services/articleApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [battleApi.reducerPath]: battleApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(battleApi.middleware, articleApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;