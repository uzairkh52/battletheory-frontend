import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Safely retrieve user from localStorage on client-side
const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') && !!initialUser : false,
  loading: false,
  error: null,
};

// ----------------------------------------------------------------------
// Async Thunks
// ----------------------------------------------------------------------

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const token = res.data.token;

      // Extract user object handling backend format variations
      const userData: User = {
        _id: res.data._id || res.data.user?._id,
        username: res.data.username || res.data.user?.username,
        email: res.data.email || res.data.user?.email,
        isAdmin: res.data.isAdmin || res.data.user?.isAdmin || false,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { user: userData, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Authentication failed');
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      const token = res.data.token;

      // Extract user payload handling backend response structures
      const userPayload: User = res.data.user
        ? res.data.user
        : {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            isAdmin: res.data.isAdmin || false,
          };

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userPayload));
      }

      return { user: userPayload, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed. Try again.');
    }
  }
);

// ----------------------------------------------------------------------
// Auth Slice
// ----------------------------------------------------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Handlers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Handlers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;