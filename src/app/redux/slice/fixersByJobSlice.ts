import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface FixersByJobState {
  searchQuery: string;
  expandedJobs: string[];
}

const initialState: FixersByJobState = {
  searchQuery: '',
  expandedJobs: [],
};

export const fixersByJobSlice = createSlice({
  name: 'fixersByJob',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleJobExpanded: (state, action: PayloadAction<string>) => {
      if (state.expandedJobs.includes(action.payload)) {
        state.expandedJobs = state.expandedJobs.filter((job) => job !== action.payload);
      } else {
        state.expandedJobs = [...state.expandedJobs, action.payload];
      }
    },
    expandAllJobs: (state, action: PayloadAction<string[]>) => {
      state.expandedJobs = action.payload;
    },
    collapseAllJobs: (state) => {
      state.expandedJobs = [];
    },
  },
});

export const { setSearchQuery, toggleJobExpanded, expandAllJobs, collapseAllJobs } =
  fixersByJobSlice.actions;

export const selectSearchQuery = (state: RootState) => state.fixersByJob.searchQuery;
export const selectExpandedJobs = (state: RootState) => state.fixersByJob.expandedJobs;

export default fixersByJobSlice.reducer;
