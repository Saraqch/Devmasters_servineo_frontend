import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './services/userApi';
import userReducer from './slice/userSlice';
import fixerReducer from './slice/fixerSlice';
import filterReducer from "./slice/filterSlice";
import jobOffersReducer from './slice/jobOffersSlice';
import jobOfertReducer from './slice/jobOfert';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    fixer: fixerReducer,
    filters: filterReducer,
    jobOffers: jobOffersReducer,
    jobOfert: jobOfertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(logger), 
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;