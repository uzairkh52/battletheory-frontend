import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Comment {
  _id: string;
  text?: string;
  content?: string;
  author?: { username: string };
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

// 1. Fetch All Battles
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

// 2. Fetch Categories (For Dropdown)
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

// 3. Fetch Single Battle by ID or Slug
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

// 4. Create Battle
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

// 5. Delete Battle
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

// 6. Add Comment to Battle
export const addBattleComment = createAsyncThunk(
  'battles/addComment',
  async (
    { battleId, text }: { battleId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post(API_ENDPOINTS.BATTLES.ADD_COMMENT(battleId), { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to post battle assessment.'
      );
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
      // Fetch All Battles
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

      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })

      // Fetch Single Battle
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

      // Create Battle
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

      // Delete Battle
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

      // Add Battle Comment
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