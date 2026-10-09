import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Comment {
  _id: string;
  author?: { _id: string; username: string };
  text: string;
  content?: string;
  createdAt: string;
  likes?: string[];
  parentComment?: string | null;
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

export const addCommentBySlug = createAsyncThunk(
  'article/addCommentBySlug',
  async (
    { slug, text }: { slug: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const cleanSlug = decodeURIComponent(slug);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await API.post(
        API_ENDPOINTS.ARTICLES.ADD_COMMENT(cleanSlug), 
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

// Toggle Like on Comment
export const toggleLikeComment = createAsyncThunk(
  'article/toggleLikeComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await API.post(`/articles/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to like comment.');
    }
  }
);

// Reply to Comment
export const replyToComment = createAsyncThunk(
  'article/replyToComment',
  async ({ commentId, text }: { commentId: string; text: string }, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await API.post(`/articles/comments/${commentId}/reply`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reply.');
    }
  }
);

// Edit Comment Thunk
export const editComment = createAsyncThunk(
  'article/editComment',
  async ({ commentId, text }: { commentId: string; text: string }, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await API.patch(`/articles/comments/${commentId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; // updated comment object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to edit comment.');
    }
  }
);

// Delete Comment Thunk
export const deleteComment = createAsyncThunk(
  'article/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await API.delete(`/articles/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return commentId; // deleted comment id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete comment.');
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
      .addCase(fetchArticleCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })
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
      })
      // Update comment after like toggle
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        if (state.article && state.article.comments) {
          const index = state.article.comments.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.article.comments[index] = {
              ...state.article.comments[index],
              likes: action.payload.likes
            };
          }
        }
      })
      // Push new reply into comments list
      .addCase(replyToComment.fulfilled, (state, action) => {
        if (state.article && state.article.comments) {
          state.article.comments.unshift(action.payload);
        }
      })
      // Edit comment in state
      .addCase(editComment.fulfilled, (state, action) => {
        if (state.article && state.article.comments) {
          const index = state.article.comments.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.article.comments[index] = {
              ...state.article.comments[index],
              text: action.payload.text,
              content: action.payload.content
            };
          }
        }
      })
      // Delete comment and its nested replies from state
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (state.article && state.article.comments) {
          const deletedId = action.payload;
          state.article.comments = state.article.comments.filter(
            c => c._id !== deletedId && c.parentComment !== deletedId
          );
        }
      });
  },
});

export const { clearArticleState } = articleSlice.actions;
export default articleSlice.reducer;