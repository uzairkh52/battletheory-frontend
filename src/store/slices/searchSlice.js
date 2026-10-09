import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Async Thunk
export const performGlobalSearch = createAsyncThunk(
  'search/performGlobalSearch',
  async (query, { rejectWithValue }) => {
    try {
      const res = await API.get(`${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
      
      if (!res.data.success) {
        throw new Error('Failed to fetch search results');
      }
      
      return res.data.results; // Returns { battles, articles, defenseNews }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to execute global search.'
      );
    }
  }
);

const initialState = {
  query: '',
  battles: [],
  articles: [],
  defenseNews: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.query = '';
      state.battles = [];
      state.articles = [];
      state.defenseNews = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performGlobalSearch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.battles = action.payload.battles || [];
        state.articles = action.payload.articles || [];
        state.defenseNews = action.payload.defenseNews || [];
      })
      .addCase(performGlobalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;