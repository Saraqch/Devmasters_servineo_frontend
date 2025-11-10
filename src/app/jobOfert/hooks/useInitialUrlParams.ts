'use client';
//src/app/jobOfert/hooks/useInitialUrlParams.ts
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './hook';
import {
  setSearch,
  setFilters,
  setSortBy,
  setPaginaActual,
  setRegistrosPorPagina,
  fetchOffers,
} from '../lib/slice';
export const useInitialUrlParams = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Leer parámetros de la URL
    const urlSearch = searchParams.get('search') || '';
    const urlCity = searchParams.get('city') || '';
    const urlCategory = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const urlSort = searchParams.get('sort') || 'recent';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlLimit = parseInt(searchParams.get('limit') || '10', 10);

    // Actualizar el estado de Redux con los valores de la URL
    if (urlSearch) dispatch(setSearch(urlSearch));
    if (urlCity || urlCategory.length > 0) {
      dispatch(setFilters({ range: [], city: urlCity, category: urlCategory }));
    }
    dispatch(setSortBy(urlSort));
    dispatch(setPaginaActual(urlPage));
    dispatch(setRegistrosPorPagina(urlLimit));

    // Hacer la petición inicial con los parámetros de la URL
    dispatch(
      fetchOffers({
        searchText: urlSearch,
        filters: { range: [], city: urlCity, category: urlCategory },
        sortBy: urlSort,
        page: urlPage,
        limit: urlLimit,
      }),
    );
  }, [searchParams, dispatch]);
};
