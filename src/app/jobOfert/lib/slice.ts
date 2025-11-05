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

interface PaginationState {//
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
  requestedPage: number;//
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
  paginaciones: Record<string, PaginationState>; // ✅ distintas claves
  
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
  paginaciones: { //distintas claves
    offers: {
      paginaActual: 1,
      registrosPorPagina: 10,
      totalRegistros: 0,
      totalPages: 0,
    },
  },
  
};

interface FetchOffersParams {
  searchText: string;
  filters: FilterState;
  sortBy: string;
  page: number;
  limit: number;
  listKey?: string; //  nueva clave
}

/*export const fetchOffers = createAsyncThunk(
  'jobOffers/fetchOffers',
  async (params: FetchOffersParams, { rejectWithValue}) => {*/
  export const fetchOffers = createAsyncThunk<FetchOffersResult, FetchOffersParams>(
  'jobOffers/fetchOffers',
   async (params, { rejectWithValue }) => {
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
          const key = params.listKey || 'offers'; // 

        return {
          listKey: key,//
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
     if (JOBOFERT_ALLOWED_LIMITS.includes(action.payload as any)) {
        state.registrosPorPagina = action.payload;
        state.paginaActual = 1;

    // Actualizar paginaciones['offers'] si existe
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
  }
},
setPaginaActual: (state, action: PayloadAction<number>) => {
    state.paginaActual = action.payload;
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

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as FetchOffersResult;//
        const key = payload.listKey || 'offers';// key 

        // Asegurar que exista la entrada para esta clave
       if (!state.paginaciones[key]) {
          state.paginaciones[key] = {
            paginaActual: 1,
            registrosPorPagina: 10,
            totalRegistros: 0,
            totalPages: 0,
         };
        }

        // Actualizar datos y paginación en la clave
          state.trabajos = payload.data;
          state.paginaciones[key].paginaActual = payload.page;
          state.paginaciones[key].registrosPorPagina = payload.limit;
          state.paginaciones[key].totalRegistros = payload.total;
          state.paginaciones[key].totalPages = payload.totalPages;
           // Sincronizar también los campos top-level para compatibilidad con código existente
          state.paginaActual = state.paginaciones[key].paginaActual;
          state.registrosPorPagina = state.paginaciones[key].registrosPorPagina;
          state.totalRegistros = state.paginaciones[key].totalRegistros;
          state.totalPages = state.paginaciones[key].totalPages;
          
        
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
  resetPagination, //  Nueva exportación
} = jobOffersSlice.actions;

// Selector para obtener la paginación por clave (por defecto 'offers')
export const selectPaginationByKey = (state: { jobOffers: JobOffersState }, key: string = 'offers'): PaginationState => {
  return state.jobOffers.paginaciones[key] ?? {
    paginaActual: 1,
    registrosPorPagina: 10,
    totalRegistros: 0,
    totalPages: 0,
  };
};


export default jobOffersSlice.reducer;
