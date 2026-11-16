import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface NewsItem {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  tacticalAnalysis?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  link?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FetchNewsParams {
  page?: number;
  limit?: number;
  category?: string;
  all?: boolean;
  append?: boolean;
}

interface NewsState {
  items: NewsItem[];
  selectedNews: NewsItem | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalNews: number;
  loading: boolean;
  detailLoading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  selectedNews: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  totalNews: 0,
  loading: false,
  detailLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

// 1. Fetch All News (Paginated + Category Filter)
export const fetchNewsList = createAsyncThunk(
  'news/fetchNewsList',
  async (params: FetchNewsParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, category, all = false } = params;
      const response = await API.get(API_ENDPOINTS.NEWS.LIST, {
        params: {
          page,
          limit,
          ...(all ? { all: 'true' } : {}),
          ...(category && category !== 'all' ? { category } : {}),
        },
      });
      return {
        data: response.data,
        append: Boolean(params.append),
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch defense news briefings.'
      );
    }
  }
);

// 2. Fetch Single News By Slug
export const fetchNewsBySlug = createAsyncThunk(
  'news/fetchNewsBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await API.get(`/news/slug/${slug}`);
      return response.data as NewsItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch news briefing.'
      );
    }
  }
);

// 3. Create News (Admin)
export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: Partial<NewsItem>, { rejectWithValue }) => {
    try {
      const response = await API.post(API_ENDPOINTS.NEWS.CREATE, newsData);
      return response.data as NewsItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create news briefing.'
      );
    }
  }
);

// 4. Update News (Admin)
export const updateNews = createAsyncThunk(
  'news/updateNews',
  async (
    { id, newsData }: { id: string; newsData: Partial<NewsItem> },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.put(API_ENDPOINTS.NEWS.UPDATE(id), newsData);
      return response.data as NewsItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update news briefing.'
      );
    }
  }
);

// 5. Delete News (Admin)
export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(API_ENDPOINTS.NEWS.DELETE(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete news briefing.'
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
    resetNewsList: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMore = false;
      state.totalNews = 0;
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
        const { data, append } = action.payload;
        const incoming: NewsItem[] = Array.isArray(data) ? data : data?.news || [];

        if (append) {
          const existingIds = new Set(state.items.map((item) => item._id || item.slug));
          const uniqueIncoming = incoming.filter(
            (item) => !existingIds.has(item._id || item.slug)
          );
          state.items = [...state.items, ...uniqueIncoming];
        } else {
          state.items = incoming;
        }

        if (!Array.isArray(data) && data) {
          state.currentPage = data.currentPage ?? 1;
          state.totalPages = data.totalPages ?? 1;
          state.hasMore = Boolean(data.hasMore);
          state.totalNews = data.totalNews ?? state.items.length;
        } else {
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasMore = false;
          state.totalNews = state.items.length;
        }
      })
      .addCase(fetchNewsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch News By Slug
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedNews = action.payload;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.detailLoading = false;
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
        state.totalNews += 1;
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
      .addCase(deleteNews.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.totalNews = Math.max(0, state.totalNews - 1);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedNews, clearNewsError, resetNewsList } = newsSlice.actions;
export default newsSlice.reducer;