import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Comment {
  _id: string;
  author?: { username: string };
  text: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  category?: string;
  createdAt: string;
  comments?: Comment[];
}

export interface CreateArticlePayload {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
}

interface ArticleState {
  articles: Article[];
  categories: Category[];
  article: Article | null;
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  submittingComment: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  categories: [],
  article: null,
  loading: false,
  creating: false,
  deleting: false,
  submittingComment: false,
  error: null,
};

// ----------------------------------------------------------------------
// Async Thunks
// ----------------------------------------------------------------------

// 1. Fetch All Articles
export const fetchAllArticles = createAsyncThunk(
  'article/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(API_ENDPOINTS.ARTICLES.LIST);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch articles archive.'
      );
    }
  }
);

// 2. Fetch Categories (For Article Category Dropdown)
export const fetchArticleCategories = createAsyncThunk(
  'article/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(API_ENDPOINTS.CATEGORIES.LIST);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch categories.'
      );
    }
  }
);

// 3. Fetch Single Article using Slug
export const fetchArticleBySlug = createAsyncThunk(
  'article/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const cleanSlug = decodeURIComponent(slug);
      const res = await API.get(API_ENDPOINTS.ARTICLES.DETAIL(cleanSlug));
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch article.'
      );
    }
  }
);

// 4. Create Article
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (payload: CreateArticlePayload, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.ARTICLES.CREATE, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Failed to create article.'
      );
    }
  }
);

// 5. Delete Article
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(API_ENDPOINTS.ARTICLES.DELETE(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete article.'
      );
    }
  }
);

// 6. Add Comment using Slug
export const addCommentBySlug = createAsyncThunk(
  'article/addCommentBySlug',
  async (
    { slug, text }: { slug: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const cleanSlug = decodeURIComponent(slug);
      const res = await API.post(API_ENDPOINTS.ARTICLES.ADD_COMMENT(cleanSlug), { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to post comment.'
      );
    }
  }
);

// ----------------------------------------------------------------------
// Slice Definition
// ----------------------------------------------------------------------

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticleState: (state) => {
      state.article = null;
      state.loading = false;
      state.creating = false;
      state.deleting = false;
      state.submittingComment = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Articles
      .addCase(fetchAllArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchArticleCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })

      // Fetch Single Article
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.creating = true;
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.creating = false;
        state.articles.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })

      // Delete Article
      .addCase(deleteArticle.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleting = false;
        state.articles = state.articles.filter((art) => art._id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })

      // Add Comment
      .addCase(addCommentBySlug.pending, (state) => {
        state.submittingComment = true;
      })
      .addCase(addCommentBySlug.fulfilled, (state, action: PayloadAction<Article>) => {
        state.submittingComment = false;
        state.article = action.payload;
      })
      .addCase(addCommentBySlug.rejected, (state, action) => {
        state.submittingComment = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearArticleState } = articleSlice.actions;
export default articleSlice.reducer;