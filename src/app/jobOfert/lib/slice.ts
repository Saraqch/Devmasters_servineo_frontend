import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ApiResponse } from '@/lib/api';

export interface OfferData {
  _id: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating: number;
}

interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
}

export interface FilterState {
  range: string[];
  city: string;
  category: string[];
  // Optional extended filters
  tags?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
}

interface JobOffersState {
  trabajos: OfferData[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sortBy: string;
  search: string;
  date?: string | null;
  rating?: number | null;
  titleOnly?: boolean;
  exact?: boolean;
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
}

const initialState: JobOffersState = {
  trabajos: [],
  loading: true,
  error: null,
  filters: { range: [], city: '', category: [] },
  sortBy: 'recent',
  search: '',
  date: null,
  rating: null,
  titleOnly: false,
  exact: false,
  paginaActual: 1,
  registrosPorPagina: 10,
  totalRegistros: 0,
};

interface FetchOffersParams {
  searchText: string;
  filters: FilterState;
  sortBy: string;
  page: number;
  limit: number;
  titleOnly?: boolean;
  exact?: boolean;
  date?: string;
  // optional integer rating (1..5) meaning filter for that integer range (1 -> 1.0-1.9)
  rating?: number;
}

export const fetchOffers = createAsyncThunk(
  'jobOffers/fetchOffers',
  async (params: FetchOffersParams, { rejectWithValue }) => {
    try {
      const urlParams = new URLSearchParams();

      if (params.searchText.trim()) {
        urlParams.append('search', params.searchText);
      }

      if (params.filters.range && params.filters.range.length > 0) {
        params.filters.range.forEach((r) => {
          urlParams.append('range', r);
        });
      }
      if (params.filters.city) {
        urlParams.append('city', params.filters.city);
      }
      if (params.filters.category && params.filters.category.length > 0) {
        params.filters.category.forEach((c) => {
          urlParams.append('category', c);
        });
      }

      if (params.sortBy) {
        urlParams.append('sortBy', params.sortBy);
      }

      // optional exact date filter (YYYY-MM-DD)
      if (params.date) {
        urlParams.append('date', params.date);
      }

      // optional rating integer 1..5 -> backend should interpret as range [n, n+0.9]
      if (params.rating != null) {
        urlParams.append('rating', String(params.rating));
      }

      if (params.titleOnly) {
        urlParams.append('titleOnly', 'true');
      }
      if (params.exact) {
        urlParams.append('exact', 'true');
      }

      // Extended filters: tags, minPrice, maxPrice
      if (params.filters.tags && params.filters.tags.length) {
        urlParams.append('tags', params.filters.tags.join(','));
      }
      if (params.filters.minPrice != null) {
        urlParams.append('minPrice', String(params.filters.minPrice));
      }
      if (params.filters.maxPrice != null) {
        urlParams.append('maxPrice', String(params.filters.maxPrice));
      }

      urlParams.append('page', params.page.toString());
      urlParams.append('limit', params.limit.toString());

      const url = `/api/devmaster/offers?${urlParams.toString()}`;
      const response: ApiResponse<OfferResponse> = await api.get(url);

      if (response.success && response.data) {
        return {
          data: response.data.data,
          total: response.data.total,
          page: params.page,
          limit: params.limit,
        };
      } else {
        return rejectWithValue(response.error || 'Error al cargar las ofertas');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión';
      return rejectWithValue(errorMsg);
    }
  },
);

const jobOffersSlice = createSlice({
  name: 'jobOffers',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },
    setTitleOnly: (state, action: PayloadAction<boolean>) => {
      state.titleOnly = action.payload;
    },
    setExact: (state, action: PayloadAction<boolean>) => {
      state.exact = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setDate: (state, action: PayloadAction<string | null>) => {
      state.date = action.payload;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },
    setRegistrosPorPagina: (state, action: PayloadAction<number>) => {
      state.registrosPorPagina = action.payload;
      state.paginaActual = 1;
    },
    setPaginaActual: (state, action: PayloadAction<number>) => {
      state.paginaActual = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { range: [], city: '', category: [] };
      state.sortBy = 'recent';
      state.search = '';
      state.paginaActual = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.trabajos = action.payload.data;
        state.totalRegistros = action.payload.total;
        state.paginaActual = action.payload.page;
        state.registrosPorPagina = action.payload.limit;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.trabajos = [];
      });
  },
});

export const {
  setSearch,
  setFilters,
  setTitleOnly,
  setExact,
  setSortBy,
  setDate,
  setRating,
  setRegistrosPorPagina,
  setPaginaActual,
  resetFilters,
} = jobOffersSlice.actions;

export default jobOffersSlice.reducer;
