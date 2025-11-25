import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobOffer } from '@/app/lib/mock-data';

interface JobOffersState {
  offers: JobOffer[];
  loading: boolean;
}

const initialState: JobOffersState = {
  offers: [],
  loading: false,
};

export const jobOffersSlice = createSlice({
  name: 'jobOffers',
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<JobOffer[]>) => {
      state.offers = action.payload;
    },
    addOffer: (state, action: PayloadAction<JobOffer>) => {
      state.offers = [action.payload, ...state.offers];
    },
    updateOffer: (state, action: PayloadAction<JobOffer>) => {
      state.offers = state.offers.map(offer =>
        offer.id === action.payload.id ? action.payload : offer
      );
    },
    deleteOffer: (state, action: PayloadAction<string>) => {
      state.offers = state.offers.filter(offer => offer.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setOffers, addOffer, updateOffer, deleteOffer, setLoading } = jobOffersSlice.actions;

export default jobOffersSlice.reducer;