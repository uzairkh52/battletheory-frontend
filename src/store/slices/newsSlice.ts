import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface NewsItem {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  summary: string;
  content: string;
  tacticalAnalysis?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  imageAlt?: string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  link?: string;
  readingTime?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsCategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  newsCount?: number;
}

interface FetchNewsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  all?: boolean;
  append?: boolean;
}

interface NewsState {
  items: NewsItem[];
  categories: NewsCategoryItem[];
  selectedNews: NewsItem | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalNews: number;
  loading: boolean;
  detailLoading: boolean;
  categoriesLoading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  categorySaving: boolean;
  error: string | null;
  categoryError: string | null;
}

const initialState: NewsState = {
  items: [],
  categories: [],
  selectedNews: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  totalNews: 0,
  loading: false,
  detailLoading: false,
  categoriesLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  categorySaving: false,
  error: null,
  categoryError: null,
};

const NEWS_CATEGORIES_ENDPOINT =
  (API_ENDPOINTS as any)?.NEWS_CATEGORIES?.LIST || '/news-categories';

const newsCategoryByIdUrl = (id: string) =>
  (API_ENDPOINTS as any)?.NEWS_CATEGORIES?.BY_ID?.(id) || `${NEWS_CATEGORIES_ENDPOINT}/${id}`;

// 1. Fetch All News (Paginated + Category & Search Filter)
export const fetchNewsList = createAsyncThunk(
  'news/fetchNewsList',
  async (params: FetchNewsParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, category, search, all = false } = params;
      const response = await API.get(API_ENDPOINTS.NEWS.LIST, {
        params: {
          page,
          limit,
          ...(all ? { all: 'true' } : {}),
          ...(category && category !== 'all' ? { category } : {}),
          ...(search && search.trim() ? { search: search.trim() } : {}),
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

// 6. Fetch News Categories
export const fetchNewsCategories = createAsyncThunk(
  'news/fetchNewsCategories',
  async (all: boolean = true, { rejectWithValue }) => {
    try {
      const response = await API.get(NEWS_CATEGORIES_ENDPOINT, {
        params: all ? { all: 'true' } : {},
      });
      return Array.isArray(response.data)
        ? response.data
        : (response.data?.categories as NewsCategoryItem[]) || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch news categories.'
      );
    }
  }
);

// 7. Create News Category (Admin)
export const createNewsCategory = createAsyncThunk(
  'news/createNewsCategory',
  async (
    payload: { name: string; description?: string; order?: number; isActive?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post(NEWS_CATEGORIES_ENDPOINT, payload);
      return response.data as NewsCategoryItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create news category.'
      );
    }
  }
);

// 8. Update News Category (Admin)
export const updateNewsCategory = createAsyncThunk(
  'news/updateNewsCategory',
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<NewsCategoryItem, 'name' | 'description' | 'order' | 'isActive'>>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.put(newsCategoryByIdUrl(id), data);
      return response.data as NewsCategoryItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update news category.'
      );
    }
  }
);

// 9. Delete News Category (Admin)
export const deleteNewsCategory = createAsyncThunk(
  'news/deleteNewsCategory',
  async ({ id, force = false }: { id: string; force?: boolean }, { rejectWithValue }) => {
    try {
      await API.delete(newsCategoryByIdUrl(id), {
        params: force ? { force: 'true' } : {},
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete news category.'
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
      state.categoryError = null;
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
      })

      // Fetch News Categories
      .addCase(fetchNewsCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchNewsCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchNewsCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoryError = action.payload as string;
      })

      // Create News Category
      .addCase(createNewsCategory.pending, (state) => {
        state.categorySaving = true;
        state.categoryError = null;
      })
      .addCase(createNewsCategory.fulfilled, (state, action) => {
        state.categorySaving = false;
        state.categories.push({ ...action.payload, newsCount: 0 });
      })
      .addCase(createNewsCategory.rejected, (state, action) => {
        state.categorySaving = false;
        state.categoryError = action.payload as string;
      })

      // Update News Category
      .addCase(updateNewsCategory.pending, (state) => {
        state.categorySaving = true;
        state.categoryError = null;
      })
      .addCase(updateNewsCategory.fulfilled, (state, action) => {
        state.categorySaving = false;
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          const oldName = state.categories[index].name;
          state.categories[index] = {
            ...state.categories[index],
            ...action.payload,
          };
          if (oldName !== action.payload.name) {
            state.items = state.items.map((item) =>
              item.category === oldName ? { ...item, category: action.payload.name } : item
            );
          }
        }
      })
      .addCase(updateNewsCategory.rejected, (state, action) => {
        state.categorySaving = false;
        state.categoryError = action.payload as string;
      })

      // Delete News Category
      .addCase(deleteNewsCategory.pending, (state) => {
        state.categorySaving = true;
        state.categoryError = null;
      })
      .addCase(deleteNewsCategory.fulfilled, (state, action) => {
        state.categorySaving = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteNewsCategory.rejected, (state, action) => {
        state.categorySaving = false;
        state.categoryError = action.payload as string;
      });
  },
});

export const { setSelectedNews, clearNewsError, resetNewsList } = newsSlice.actions;
export default newsSlice.reducer;