import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Comment {
  _id: string;
  text?: string;
  content?: string;
  author?: { _id: string; username: string };
  parentComment?: string;
  likes?: string[];
  createdAt: string;
}

export interface TacticalPhase {
  phaseName?: string;
  details?: string;
  name?: string;
  description?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Battle {
  _id: string;
  name?: string;
  title?: string;
  slug?: string;
  year: string | number;
  location?: string;
  theater?: string;
  description?: string;
  summary?: string;
  coordinates?: { lat: number; lng: number } | [number, number];
  tacticalPhases?: TacticalPhase[];
  phases?: TacticalPhase[];
  comments?: Comment[];
  category?: string;
  featuredImage?: string; // 🌟 Added featuredImage field
}

export interface CreateBattlePayload {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  year: number;
  coordinates: [number, number];
  phases: { name: string; description: string }[];
  featuredImage?: string; // 🌟 Added featuredImage payload field
}

interface BattleState {
  battles: Battle[];
  categories: Category[];
  currentBattle: Battle | null;
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  submittingComment: boolean;
  error: string | null;
}

const initialState: BattleState = {
  battles: [],
  categories: [],
  currentBattle: null,
  loading: false,
  creating: false,
  deleting: false,
  submittingComment: false,
  error: null,
};

// ----------------------------------------------------------------------
// Async Thunks
// ----------------------------------------------------------------------

export const fetchAllBattles = createAsyncThunk(
  'battles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(API_ENDPOINTS.BATTLES.LIST);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load geospatial battle data.'
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'battles/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(API_ENDPOINTS.CATEGORIES.LIST);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load categories.'
      );
    }
  }
);

export const fetchBattleByIdOrSlug = createAsyncThunk(
  'battles/fetchByIdOrSlug',
  async (idOrSlug: string, { rejectWithValue }) => {
    try {
      const cleanSlug = decodeURIComponent(idOrSlug);
      const res = await API.get(API_ENDPOINTS.BATTLES.DETAIL(cleanSlug));
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Battle records not found.'
      );
    }
  }
);

export const createBattle = createAsyncThunk(
  'battles/createBattle',
  async (payload: CreateBattlePayload, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.BATTLES.CREATE, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Failed to create battle.'
      );
    }
  }
);

// 🌟 Added updateBattle Async Thunk
export const updateBattle = createAsyncThunk(
  'battles/updateBattle',
  async ({ id, battleData }: { id: string; battleData: Partial<CreateBattlePayload> }, { rejectWithValue }) => {
    try {
      const res = await API.put(`${API_ENDPOINTS.BATTLES.LIST}/${id}`, battleData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Failed to update battle.'
      );
    }
  }
);

export const deleteBattle = createAsyncThunk(
  'battles/deleteBattle',
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(API_ENDPOINTS.BATTLES.DELETE(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete battle.'
      );
    }
  }
);

// Add Comment or Reply
export const addBattleComment = createAsyncThunk(
  'battles/addComment',
  async (
    { battleId, text, parentComment }: { battleId: string; text: string; parentComment?: string | null },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post(`/battles/${battleId}/comments`, { text, parentComment });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to post comment.');
    }
  }
);

// Toggle Like
export const toggleLikeBattleComment = createAsyncThunk(
  'battles/toggleLikeComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const res = await API.put(`/battles/comments/${commentId}/like`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle like.');
    }
  }
);

// Edit Comment
export const editBattleComment = createAsyncThunk(
  'battles/editComment',
  async ({ commentId, text }: { commentId: string; text: string }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/battles/comments/${commentId}`, { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update comment.');
    }
  }
);

// Delete Comment
export const deleteBattleComment = createAsyncThunk(
  'battles/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await API.delete(`/battles/comments/${commentId}`);
      return commentId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete comment.');
    }
  }
);

// ----------------------------------------------------------------------
// Slice Definition
// ----------------------------------------------------------------------

const battleSlice = createSlice({
  name: 'battles',
  initialState,
  reducers: {
    setSelectedBattleInState: (state, action: PayloadAction<Battle | null>) => {
      state.currentBattle = action.payload;
    },
    clearBattleState: (state) => {
      state.currentBattle = null;
      state.loading = false;
      state.creating = false;
      state.deleting = false;
      state.submittingComment = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBattles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBattles.fulfilled, (state, action: PayloadAction<Battle[]>) => {
        state.loading = false;
        state.battles = action.payload;
      })
      .addCase(fetchAllBattles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })
      .addCase(fetchBattleByIdOrSlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBattleByIdOrSlug.fulfilled, (state, action: PayloadAction<Battle>) => {
        state.loading = false;
        state.currentBattle = action.payload;
      })
      .addCase(fetchBattleByIdOrSlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBattle.pending, (state) => {
        state.creating = true;
      })
      .addCase(createBattle.fulfilled, (state, action: PayloadAction<Battle>) => {
        state.creating = false;
        state.battles.unshift(action.payload);
      })
      .addCase(createBattle.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      // 🌟 Added Update Battle ExtraReducers
      .addCase(updateBattle.pending, (state) => {
        state.creating = true;
      })
      .addCase(updateBattle.fulfilled, (state, action: PayloadAction<Battle>) => {
        state.creating = false;
        const index = state.battles.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.battles[index] = action.payload;
        }
        if (state.currentBattle && state.currentBattle._id === action.payload._id) {
          state.currentBattle = action.payload;
        }
      })
      .addCase(updateBattle.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBattle.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteBattle.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleting = false;
        state.battles = state.battles.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBattle.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })
      // Add Comment
      .addCase(addBattleComment.pending, (state) => {
        state.submittingComment = true;
      })
      .addCase(addBattleComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.submittingComment = false;
        if (state.currentBattle) {
          state.currentBattle.comments = [
            action.payload,
            ...(state.currentBattle.comments || []),
          ];
        }
      })
      .addCase(addBattleComment.rejected, (state, action) => {
        state.submittingComment = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBattleInState, clearBattleState } = battleSlice.actions;
export default battleSlice.reducer;