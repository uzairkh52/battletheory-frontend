import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface NewsItem {
  _id?: string;
  title: string;
  slug?: string;
  category: string;
  source: string;
  sourceUrl?: string;
  link?: string;
  summary: string;
  content?: string;
  isPublished?: boolean;
  createdAt?: string;
}

interface NewsState {
  items: NewsItem[];
  selectedNews: NewsItem | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  selectedNews: null,
  loading: false,
  creating: false,
  updating: false,
  error: null,
};

// 1. Fetch all news
export const fetchNewsList = createAsyncThunk(
  'news/fetchNewsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_ENDPOINTS.NEWS.LIST);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch defense news feeds.'
      );
    }
  }
);

// 2. Fetch single news by Slug (Dynamic detail page)
export const fetchNewsBySlug = createAsyncThunk(
  'news/fetchNewsBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await API.get(`/news/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch news report.'
      );
    }
  }
);

// 3. Create news record
export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: NewsItem, { rejectWithValue }) => {
    try {
      const response = await API.post(API_ENDPOINTS.NEWS.CREATE, newsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create news record.'
      );
    }
  }
);

// 4. Update news record
export const updateNews = createAsyncThunk(
  'news/updateNews',
  async ({ id, newsData }: { id: string; newsData: Partial<NewsItem> }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/news/${id}`, newsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update news record.'
      );
    }
  }
);

// 5. Delete news record
export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(API_ENDPOINTS.NEWS.DELETE(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete news record.'
      );
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSelectedNews: (state, action: PayloadAction<NewsItem | null>) => {
      state.selectedNews = action.payload;
    },
    clearNewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch News List
      .addCase(fetchNewsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNewsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch News By Slug
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNews = action.payload;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create News
      .addCase(createNews.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      // Update News
      .addCase(updateNews.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedNews?._id === action.payload._id) {
          state.selectedNews = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      // Delete News
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { setSelectedNews, clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;