import { filtersToUrlParams } from './parsers';
import { markFromAdvSearch, saveAdvSearchState, type AdvSearchState } from './session';
import { FilterState } from './types';

/**
 * Navegación desde AdvSearch a ResultsAdvSearch
 */
export function navigateToResults(params: {
  search: string;
  filters: FilterState;
  sortBy: string;
  date?: string | null;
  rating?: number | null;
  titleOnly?: boolean;
  exact?: boolean;
  // Estado completo de AdvSearch para persistir
  advSearchState?: AdvSearchState;
}) {
  const urlParams = filtersToUrlParams({
    search: params.search,
    filters: params.filters,
    sortBy: params.sortBy,
    date: params.date,
    rating: params.rating,
    titleOnly: params.titleOnly,
    exact: params.exact,
    page: 1,
    limit: 10,
  });

  // Marcar que viene de búsqueda avanzada
  markFromAdvSearch();
  
  // Agregar flag a URL
  urlParams.set('fromAdv', 'true');

  // Persistir estado de AdvSearch si se proporciona
  if (params.advSearchState) {
    saveAdvSearchState(params.advSearchState);
  }

  // Navegar
  if (typeof window !== 'undefined') {
    window.location.href = `/resultsAdvSearch?${urlParams.toString()}`;
  }
}

/**
 * Navegación limpia a JobOffer (sin parámetros)
 */
export function navigateToJobOfferClean() {
  if (typeof window !== 'undefined') {
    window.location.href = '/job-offer-list';
  }
}

/**
 * Navegación a JobOffer con parámetros
 */
export function navigateToJobOffer(params: {
  search?: string;
  filters?: FilterState;
  sortBy?: string;
  date?: string | null;
  rating?: number | null;
  page?: number;
  limit?: number;
  titleOnly?: boolean;
  exact?: boolean;
}) {
  const urlParams = filtersToUrlParams(params);
  const queryString = urlParams.toString();
  const target = queryString ? `/job-offer?${queryString}` : '/job-offer';

  if (typeof window !== 'undefined') {
    window.location.href = target;
  }
}

/**
 * Actualizar URL sin navegación completa
 */
export function updateUrlParams(params: {
  search?: string;
  filters?: FilterState;
  sortBy?: string;
  date?: string | null;
  rating?: number | null;
  page?: number;
  limit?: number;
  titleOnly?: boolean;
  exact?: boolean;
}) {
  if (typeof window === 'undefined') return;

  const urlParams = filtersToUrlParams(params);
  const queryString = urlParams.toString();
  const targetSearch = queryString ? `?${queryString}` : '';

  // Solo actualizar si es diferente
  if (window.location.search !== targetSearch) {
    try {
      window.history.replaceState(
        null, 
        '', 
        window.location.pathname + targetSearch
      );
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  }
}