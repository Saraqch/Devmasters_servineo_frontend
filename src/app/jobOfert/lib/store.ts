// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { jobOfertApi } from './api/jobOfert.api';

export const store = configureStore({
  reducer: {
    [jobOfertApi.reducerPath]: jobOfertApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobOfertApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
