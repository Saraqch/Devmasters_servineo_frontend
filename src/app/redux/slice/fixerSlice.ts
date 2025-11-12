import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fixer } from '@/app/lib/mock-data';

interface FixerState {
  currentFixer: Fixer | null;
  loading: boolean;
}

const initialState: FixerState = {
  currentFixer: null,
  loading: false,
};

export const fixerSlice = createSlice({
  name: 'fixer',
  initialState,
  reducers: {
    setFixer: (state, action: PayloadAction<Fixer>) => {
      state.currentFixer = action.payload;
    },
    updateFixer: (state, action: PayloadAction<Partial<Fixer>>) => {
      if (state.currentFixer) {
        state.currentFixer = { ...state.currentFixer, ...action.payload };
      }
    },
    clearFixer: (state) => {
      state.currentFixer = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setFixer, updateFixer, clearFixer, setLoading } = fixerSlice.actions;

export default fixerSlice.reducer;
