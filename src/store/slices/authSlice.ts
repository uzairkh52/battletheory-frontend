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
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
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
  users: [],
  usersLoading: false,
  usersError: null,
};

// ----------------------------------------------------------------------
// Async Thunks
// ----------------------------------------------------------------------

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
      const token = res.data.token;

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
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await API.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const token = res.data.token;

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
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch All Users (Admin Panel)
export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Toggle User Admin Role
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.put(
        `/auth/users/${userId}/role`,
        { isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update role');
    }
  }
);

// ----------------------------------------------------------------------
// Slice Definition
// ----------------------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.users = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Users Cases
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      })
      // Update User Role Case
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index].isAdmin = updatedUser.isAdmin;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;