import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './services/baseApi';
import userReducer from './slice/userSlice';
import fixerReducer from './slice/fixerSlice';
import filterReducer from './slice/filterSlice';
import jobOffersReducer from './slice/jobOffersSlice';
import jobOfertReducer from './slice/jobOfert';
import fixersByJobReducer from './slice/fixersByJobSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
    fixer: fixerReducer,
    filters: filterReducer,
    jobOffers: jobOffersReducer,
    jobOfert: jobOfertReducer,
    fixersByJob: fixersByJobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
