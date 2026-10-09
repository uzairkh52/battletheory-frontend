import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/lib/api';

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/bookmarks');
      return res.data.bookmarks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleBookmarkAPI = createAsyncThunk(
  'bookmarks/toggleBookmark',
  async (bookmarkData, { rejectWithValue }) => {
    try {
      const res = await API.post('/bookmarks/toggle', bookmarkData);
      return { bookmarked: res.data.bookmarked, bookmark: res.data.bookmark, itemId: bookmarkData.itemId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleBookmarkAPI.fulfilled, (state, action) => {
        const { bookmarked, bookmark, itemId } = action.payload;
        if (bookmarked) {
          state.items.unshift(bookmark);
        } else {
          state.items = state.items.filter((b) => b.itemId !== itemId);
        }
      });
  },
});

export default bookmarkSlice.reducer;