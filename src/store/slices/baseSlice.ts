import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface BaseState {
  sidebarOpen: boolean;
  activeModal: string | null;
  globalLoading: boolean;
  themeMode: 'dark' | 'light';
  activeTab: string;
  // 🌟 Integrated Contact Command State
  contact: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
}

const initialState: BaseState = {
  sidebarOpen: false,
  activeModal: null,
  globalLoading: false,
  themeMode: 'dark',
  activeTab: 'overview',
  contact: {
    loading: false,
    success: false,
    error: null,
  },
};

// 🌟 Async Thunk to dispatch Contact API Request
export const sendContactMessage = createAsyncThunk<
  { success: boolean; message: string },
  ContactFormData,
  { rejectValue: string }
>('base/sendContactMessage', async (formData, { rejectWithValue }) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const response = await fetch(`${API_URL}${API_ENDPOINTS.CONTACT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to deliver transmission.');
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Network communication error.');
  }
});

const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.themeMode = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    // 🌟 Reset Contact State Action
    resetContactState: (state) => {
      state.contact.loading = false;
      state.contact.success = false;
      state.contact.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.contact.loading = true;
        state.contact.error = null;
        state.contact.success = false;
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.contact.loading = false;
        state.contact.success = true;
        state.contact.error = null;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.contact.loading = false;
        state.contact.success = false;
        state.contact.error = action.payload || 'Transmission failed.';
      });
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveModal,
  setGlobalLoading,
  setThemeMode,
  setActiveTab,
  resetContactState,
} = baseSlice.actions;

export default baseSlice.reducer;