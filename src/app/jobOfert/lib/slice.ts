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
  // --- NUEVOS FILTROS ---
  tags: string[]; // Usaremos un array de strings para las etiquetas
  minPrice: number | null; // Usaremos number para la lógica de precio
  maxPrice: number | null; // Usaremos number para la lógica de precio
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

const initialState: JobOffersState = {
  trabajos: [],
  loading: true,
  error: null,
  filters: { range: [], city: '', category: [], tags: [], minPrice: null, maxPrice: null }, // AÑADIDO Al GITHUB
  sortBy: 'recent',
  search: '',
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
      // --- AGREGAR LÓGICA DE PRECIO (CORREGIDA) ---
      if (params.filters.minPrice !== null) {
          // CORRECCIÓN: Usar interpolación de cadenas para conversión segura
          urlParams.append('minPrice', encodeURIComponent(`${params.filters.minPrice}`)); 
      }
      if (params.filters.maxPrice !== null) {
          // CORRECCIÓN: Usar interpolación de cadenas para conversión segura
          urlParams.append('maxPrice', encodeURIComponent(`${params.filters.maxPrice}`));
      }
      // --- AGREGAR LÓGICA DE ETIQUETAS (MANTENER) ---
      if (params.filters.tags && params.filters.tags.length > 0) {
          // El backend espera una lista de tags separada por comas (ej: tag1,tag2)
          urlParams.append('tags', encodeURIComponent(params.filters.tags.join(','))); 
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
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setRegistrosPorPagina: (state, action: PayloadAction<number>) => {
      state.registrosPorPagina = action.payload;
      state.paginaActual = 1;
    },
    setPaginaActual: (state, action: PayloadAction<number>) => {
      state.paginaActual = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { range: [], city: '', category: [], tags: [], minPrice: null, maxPrice: null };// aca se modifico , tags: [], minPrice: null, maxPrice: null
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
  setSortBy,
  setRegistrosPorPagina,
  setPaginaActual,
  resetFilters,
} = jobOffersSlice.actions;

export default jobOffersSlice.reducer;
