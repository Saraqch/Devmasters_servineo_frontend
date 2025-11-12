'use client';
//src/app/job-offer/hooks/useInitialUrlParams.ts
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './hook';
import {
  setSearch,
  setFilters,
  setSortBy,
  setPaginaActual,
  setRegistrosPorPagina,
  setDate,
  setRating,
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
    const urlRanges = searchParams.getAll('range') || [];
    const urlCity = searchParams.get('city') || '';
    const urlCategory = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const urlTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const urlMin = searchParams.get('minPrice');
    const urlMax = searchParams.get('maxPrice');
    const urlTitleOnly = searchParams.get('titleOnly');
    const urlExact = searchParams.get('exact');
    const urlDate = searchParams.get('date') || null;
    const urlRating = searchParams.get('rating');
    // support both `sort` and `sortBy` (AdvSearch may set either)
    const urlSort = searchParams.get('sortBy') || searchParams.get('sort') || 'recent';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlLimit = parseInt(searchParams.get('limit') || '10', 10);

    // Normalize numeric values
    const minPrice = urlMin ? Number(urlMin) : null;
    const maxPrice = urlMax ? Number(urlMax) : null;
    const rating = urlRating ? Number(urlRating) : null;
    // ratingForFetch is a number | undefined to satisfy fetchOffers typing
    const ratingForFetch =
      urlRating != null && !Number.isNaN(Number(urlRating)) ? Number(urlRating) : undefined;
    const titleOnly = urlTitleOnly === 'true';
    const exact = urlExact === 'true';

    // Construir objeto filters completo
    const filters = {
      range: urlRanges,
      city: urlCity,
      category: urlCategory,
      tags: urlTags,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
    };

    // Actualizar el estado de Redux con los valores de la URL
    if (urlSearch) dispatch(setSearch(urlSearch));
    // Siempre actualizar filters (puede ser vacío)
    dispatch(
      setFilters({
        range: filters.range || [],
        city: filters.city || '',
        category: filters.category || [],
      }),
    );
    // Guardar sort, pagina y limite
    dispatch(setSortBy(urlSort));
    dispatch(setPaginaActual(urlPage));
    dispatch(setRegistrosPorPagina(urlLimit));
    // set optional top-level fields if available
    if (urlDate) dispatch(setDate(urlDate));
    if (!Number.isNaN(rating) && urlRating != null) dispatch(setRating(rating));
    if (titleOnly) dispatch({ type: 'jobOffers/setTitleOnly', payload: true });
    if (exact) dispatch({ type: 'jobOffers/setExact', payload: true });

    // Hacer la petición inicial con los parámetros de la URL (incluyendo titleOnly/exact/date/rating)
    dispatch(
      fetchOffers({
        searchText: urlSearch,
        filters: {
          range: filters.range || [],
          city: filters.city || '',
          category: filters.category || [],
          tags: filters.tags || [],
          minPrice: minPrice ?? null,
          maxPrice: maxPrice ?? null,
        },
        sortBy: urlSort,
        date: urlDate || undefined,
        rating: ratingForFetch,
        page: urlPage,
        limit: urlLimit,
        titleOnly,
        exact,
      }),
    );
  }, [searchParams, dispatch]);
};
