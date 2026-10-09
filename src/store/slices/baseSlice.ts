import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BaseState {
  sidebarOpen: boolean;
  activeModal: string | null;
  globalLoading: boolean;
  themeMode: 'dark' | 'light';
  activeTab: string;
}

const initialState: BaseState = {
  sidebarOpen: false,
  activeModal: null,
  globalLoading: false,
  themeMode: 'dark',
  activeTab: 'overview',
};

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
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveModal,
  setGlobalLoading,
  setThemeMode,
  setActiveTab,
} = baseSlice.actions;

export default baseSlice.reducer;