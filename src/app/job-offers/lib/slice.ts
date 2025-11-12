// src\app\job-offer\lib\slice.ts
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
}

interface PaginationState {
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
  totalPages: number;
}

interface FetchOffersResult {
  listKey: string;
  data: OfferData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  requestedPage: number;
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
  totalPages: number;
  paginaciones: Record<string, PaginationState>;
}

// Helper para leer localStorage de forma segura (genérico)
const getStoredValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper para guardar en localStorage (genérico)
const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }
};

// Estado inicial con valores de localStorage
const getInitialJobOffersState = (): JobOffersState => {
  const savedPage = getStoredValue('jobOffers_paginaActual', 1);
  const savedPageSize = getStoredValue('jobOffers_registrosPorPagina', 10);
  const savedSearch = getStoredValue('jobOffers_search', '');
  const savedFilters = getStoredValue('jobOffers_filters', {
    range: [],
    city: '',
    category: [],
  });
  const savedSortBy = getStoredValue('jobOffers_sortBy', 'recent');

  return {
    trabajos: [],
    loading: true,
    error: null,
    filters: savedFilters,
    sortBy: savedSortBy,
    search: savedSearch,
    date: null,
    rating: null,
    titleOnly: false,
    exact: false,
    paginaActual: savedPage,
    registrosPorPagina: savedPageSize,
    totalRegistros: 0,
    totalPages: 0,
    paginaciones: {
      offers: {
        paginaActual: savedPage,
        registrosPorPagina: savedPageSize,
        totalRegistros: 0,
        totalPages: 0,
      },
    },
  };
};

const initialState: JobOffersState = getInitialJobOffersState();

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
  listKey?: string;
}

export const fetchOffers = createAsyncThunk<FetchOffersResult, FetchOffersParams>(
  'jobOffers/fetchOffers',
  async (params, { rejectWithValue }) => {
    try {
      // Validar que el límite sea uno de los permitidos
      if (!JOBOFERT_ALLOWED_LIMITS.includes(params.limit)) {
        return rejectWithValue(
          `Límite no permitido. Valores permitidos: ${JOBOFERT_ALLOWED_LIMITS.join(', ')}`,
        );
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
        const totalPages = Math.ceil(response.data.total / params.limit) || 1;
        const key = params.listKey || 'offers';

        return {
          listKey: key,
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
      saveToStorage('jobOffers_search', action.payload);
    },

    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
      saveToStorage('jobOffers_filters', action.payload);
    },
    setTitleOnly: (state, action: PayloadAction<boolean>) => {
      state.titleOnly = action.payload;
    },
    setExact: (state, action: PayloadAction<boolean>) => {
      state.exact = action.payload;
    },

    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      saveToStorage('jobOffers_sortBy', action.payload);
    },
    setDate: (state, action: PayloadAction<string | null>) => {
      state.date = action.payload;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },

    setRegistrosPorPagina: (state, action: PayloadAction<number>) => {
      // Validar que el límite sea permitido
      if (!JOBOFERT_ALLOWED_LIMITS.includes(action.payload)) {
        return;
      }

      state.registrosPorPagina = action.payload;
      state.paginaActual = 1;
      saveToStorage('jobOffers_registrosPorPagina', action.payload);
      saveToStorage('jobOffers_paginaActual', 1);

      // Actualizar paginaciones['offers']
      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: action.payload,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].registrosPorPagina = action.payload;
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    setPaginaActual: (state, action: PayloadAction<number>) => {
      state.paginaActual = action.payload;
      saveToStorage('jobOffers_paginaActual', action.payload);

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: action.payload,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = action.payload;
      }
    },

    resetFilters: (state) => {
      state.filters = { range: [], city: '', category: [] };
      state.sortBy = 'recent';
      state.search = '';
      state.paginaActual = 1;

      // Guardar en localStorage
      saveToStorage('jobOffers_filters', state.filters);
      saveToStorage('jobOffers_sortBy', state.sortBy);
      saveToStorage('jobOffers_search', state.search);
      saveToStorage('jobOffers_paginaActual', 1);

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    resetPagination: (state) => {
      state.paginaActual = 1;
      saveToStorage('jobOffers_paginaActual', 1);

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    restoreSavedState: (state) => {
      // Restaurar desde localStorage
      state.search = getStoredValue('jobOffers_search', '');
      state.filters = getStoredValue('jobOffers_filters', { range: [], city: '', category: [] });
      state.sortBy = getStoredValue('jobOffers_sortBy', 'recent');
      state.paginaActual = getStoredValue('jobOffers_paginaActual', 1);
      state.registrosPorPagina = getStoredValue('jobOffers_registrosPorPagina', 10);

      // Actualizar paginaciones['offers']
      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: state.paginaActual,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      }
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
        const payload = action.payload as FetchOffersResult;
        const key = payload.listKey || 'offers';

        // Asegurar que exista la entrada para esta clave
        if (!state.paginaciones[key]) {
          state.paginaciones[key] = {
            paginaActual: 1,
            registrosPorPagina: 10,
            totalRegistros: 0,
            totalPages: 0,
          };
        }

        // Actualizar datos
        state.trabajos = payload.data;

        // Actualizar paginación en la clave específica
        state.paginaciones[key].paginaActual = payload.page;
        state.paginaciones[key].registrosPorPagina = payload.limit;
        state.paginaciones[key].totalRegistros = payload.total;
        state.paginaciones[key].totalPages = payload.totalPages;

        // Sincronizar campos top-level para compatibilidad
        state.paginaActual = state.paginaciones[key].paginaActual;
        state.registrosPorPagina = state.paginaciones[key].registrosPorPagina;
        state.totalRegistros = state.paginaciones[key].totalRegistros;
        state.totalPages = state.paginaciones[key].totalPages;

        // Guardar en localStorage
        saveToStorage('jobOffers_paginaActual', state.paginaActual);

        // Manejo de páginas que no existen
        if (
          action.payload.requestedPage > action.payload.totalPages &&
          action.payload.totalPages > 0
        ) {
          state.error = `Página ${action.payload.requestedPage} no existe. Total de páginas: ${action.payload.totalPages}. Ajustando a página 1.`;
          state.paginaActual = 1;
          saveToStorage('jobOffers_paginaActual', 1);
        } else {
          state.error = null;
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
  setTitleOnly,
  setExact,
  setSortBy,
  setDate,
  setRating,
  setRegistrosPorPagina,
  setPaginaActual,
  resetFilters,
  resetPagination,
  restoreSavedState,
} = jobOffersSlice.actions;

// Selector para obtener la paginación por clave (por defecto 'offers')
export const selectPaginationByKey = (
  state: { jobOffers: JobOffersState },
  key: string = 'offers',
): PaginationState => {
  return (
    state.jobOffers.paginaciones[key] ?? {
      paginaActual: 1,
      registrosPorPagina: 10,
      totalRegistros: 0,
      totalPages: 0,
    }
  );
};

export default jobOffersSlice.reducer;
