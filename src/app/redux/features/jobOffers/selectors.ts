// src\app\redux\hook\jobOffersSelectors.ts
import { JobOffersState, PaginationState } from './types';
import { createSelector } from '@reduxjs/toolkit';

type RootState = { jobOfert: JobOffersState };

export const selectPaginationByKey = (
  state: RootState,
  key: string = 'offers',
): PaginationState => {
  return (
    state.jobOfert.paginaciones[key] ?? {
      paginaActual: 1,
      registrosPorPagina: 10,
      totalRegistros: 0,
      totalPages: 0,
    }
  );
};

export const selectJobOffersState = (state: RootState) => state.jobOfert;

export const selectFilters = (state: RootState) => state.jobOfert.filters;

export const selectSearch = (state: RootState) => state.jobOfert.search;

export const selectSortBy = (state: RootState) => state.jobOfert.sortBy;

export const selectPaginaActual = (state: RootState) => state.jobOfert.paginaActual;

export const selectRegistrosPorPagina = (state: RootState) => state.jobOfert.registrosPorPagina;

export const selectTotalRegistros = (state: RootState) => state.jobOfert.totalRegistros;

export const selectTotalPages = (state: RootState) => state.jobOfert.totalPages;

export const selectDate = (state: RootState) => state.jobOfert.date;

export const selectRating = (state: RootState) => state.jobOfert.rating;

export const selectTitleOnly = (state: RootState) => state.jobOfert.titleOnly;

export const selectExact = (state: RootState) => state.jobOfert.exact;

export const selectLoading = (state: RootState) => state.jobOfert.loading;

export const selectError = (state: RootState) => state.jobOfert.error;

export const selectShouldPersist = (state: RootState) => state.jobOfert.shouldPersist;

// Selector compuesto para obtener todos los parámetros de búsqueda
export const selectSearchParams = createSelector(
  [
    (state: RootState) => state.jobOfert.search,
    (state: RootState) => state.jobOfert.filters,
    (state: RootState) => state.jobOfert.sortBy,
    (state: RootState) => state.jobOfert.date,
    (state: RootState) => state.jobOfert.rating,
    (state: RootState) => state.jobOfert.paginaActual,
    (state: RootState) => state.jobOfert.registrosPorPagina,
    (state: RootState) => state.jobOfert.titleOnly,
    (state: RootState) => state.jobOfert.exact,
  ],
  (search, filters, sortBy, date, rating, page, limit, titleOnly, exact) => ({
    search,
    filters,
    sortBy,
    date,
    rating,
    page,
    limit,
    titleOnly,
    exact,
  }),
);
