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
}

interface JobOffersState {
  trabajos: OfferData[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sortBy: string;
  search: string;
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
}

const getStoredValue = (key: string, defaultValue: any): any => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};
const getInitialJobOffersState = () => {
  // Verificar si existe una página guardada
  const savedPage = getStoredValue('jobOffers_paginaActual', 1);
  const savedPageSize = getStoredValue('jobOffers_registrosPorPagina', 10);
  
  // Opcional: también podrías guardar filtros y búsqueda si lo necesitas
  const savedSearch = getStoredValue('jobOffers_search', '');
  const savedFilters = getStoredValue('jobOffers_filters', { 
    range: [], city: '', category: [] 
  });
  const savedSortBy = getStoredValue('jobOffers_sortBy', 'recent');

  return {
    trabajos: [],
    loading: true,
    error: null,
    filters: savedFilters,
    sortBy: savedSortBy,
    search: savedSearch,
    paginaActual: savedPage,
    registrosPorPagina: savedPageSize,
    totalRegistros: 0,
  };
};

const initialState: JobOffersState = getInitialJobOffersState();

interface FetchOffersParams {
  searchText: string;
  filters: FilterState;
  sortBy: string;
  page: number;
  limit: number;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_search', JSON.stringify(action.payload));
      }
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_filters', JSON.stringify(action.payload));
      }
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_sortBy', JSON.stringify(action.payload));
      }
    },
    setRegistrosPorPagina: (state, action: PayloadAction<number>) => {
      state.registrosPorPagina = action.payload;
      state.paginaActual = 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_registrosPorPagina', JSON.stringify(action.payload));
      }
    },
    setPaginaActual: (state, action: PayloadAction<number>) => {
      state.paginaActual = action.payload;
        if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_paginaActual', JSON.stringify(action.payload));
      }
    },
    resetFilters: (state) => {
      state.filters = { range: [], city: '', category: [] };
      state.sortBy = 'recent';
      state.search = '';
      state.paginaActual = 1;
       if (typeof window !== 'undefined') {
        localStorage.setItem('jobOffers_filters', JSON.stringify({ range: [], city: '', category: [] }));
        localStorage.setItem('jobOffers_sortBy', JSON.stringify('recent'));
        localStorage.setItem('jobOffers_search', JSON.stringify(''));
        localStorage.setItem('jobOffers_paginaActual', JSON.stringify(1));
      }
    },
    // clearPersistedState: (state) => {
    //   if (typeof window !== 'undefined') {
    //     localStorage.removeItem('jobOffers_paginaActual');
    //     localStorage.removeItem('jobOffers_registrosPorPagina');
    //   }
    //   state.paginaActual = 1;
    //   state.registrosPorPagina = 10;
    // },
    restoreSavedState: (state) => {
      const savedState = getInitialJobOffersState();
      return {
        ...state,
        filters: savedState.filters,
        sortBy: savedState.sortBy,
        search: savedState.search,
        paginaActual: savedState.paginaActual,
        registrosPorPagina: savedState.registrosPorPagina,
      };
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('jobOffers_paginaActual', JSON.stringify(action.payload.page));
          localStorage.setItem('jobOffers_registrosPorPagina', JSON.stringify(action.payload.limit));
        }
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
  setSortBy,
  setRegistrosPorPagina,
  setPaginaActual,
  resetFilters,
  // clearPersistedState,
  restoreSavedState,
} = jobOffersSlice.actions;

export default jobOffersSlice.reducer;
