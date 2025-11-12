import { configureStore } from '@reduxjs/toolkit';
import jobOffersReducer from './slice';

export const store = configureStore({
  reducer: {
    jobOffers: jobOffersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
