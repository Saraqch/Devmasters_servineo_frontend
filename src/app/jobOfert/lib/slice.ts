import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ApiResponse } from '@/lib/api';
import { JOBOFERT_ALLOWED_LIMITS } from '../validators/pagination.validator';

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
  currentPage?: number;
  totalPages?: number;
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
  totalPages: number;
}

const initialState: JobOffersState = {
  trabajos: [],
  loading: true,
  error: null,
  filters: { range: [], city: '', category: [] },
  sortBy: 'recent',
  search: '',
  paginaActual: 1,
  registrosPorPagina: 10,
  totalRegistros: 0,
  totalPages: 0,
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
  async (params: FetchOffersParams, { rejectWithValue}) => {
    try {

      // Validar que el límite sea uno de los permitidos
      if (!JOBOFERT_ALLOWED_LIMITS.includes(params.limit as any)) {
        return rejectWithValue(`Límite no permitido. Valores permitidos: ${JOBOFERT_ALLOWED_LIMITS.join(', ')}`);
      }

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
          const totalPages = Math.ceil(response.data.total / params.limit) || 1;

        return {
          data: response.data.data,
          total: response.data.total,
          page: params.page,
          limit: params.limit,
          totalPages: totalPages,
          requestedPage: params.page,
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
      // Validar que el límite sea permitido
      if (JOBOFERT_ALLOWED_LIMITS.includes(action.payload as any)) {
        state.registrosPorPagina = action.payload;
        state.paginaActual = 1;
      }
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
        state.totalPages = action.payload.totalPages;
        
        // Si hubo redirección automática, mostrar info en consola
        if (action.payload.requestedPage > action.payload.totalPages && action.payload.totalPages > 0) {
          // Si la página no existe, ajustar a página 1
          state.error = `Página ${action.payload.requestedPage} no existe. Total de páginas: ${action.payload.totalPages}. Ajustando a página 1.`;
          state.paginaActual = 1;
        } else {
          state.paginaActual = action.payload.page;
          state.error = null;
        }
        
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
