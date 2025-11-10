import { useEffect, useRef } from 'react';
import { useAppDispatch } from './hook';
import {
  setSearch,
  setFilters,
  setSortBy,
  setDate,
  setRating,
  setPaginaActual,
  setRegistrosPorPagina,
  fetchOffers,
  setTitleOnly,
  setExact,
} from '../lib/slice';

/**
 * Minimal hook: on client mount read URL query params and apply them to the redux store
 * and trigger a fetch. Keeps changes small and local.
 */
const useApplyQueryToStore = () => {
  const dispatch = useAppDispatch();
  const appliedRef = useRef(false);

  useEffect(() => {
    // only run on client
    if (typeof window === 'undefined') return;
    // Only apply once to avoid loops between reading URL -> dispatch -> syncURL hooks
    if (appliedRef.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    // detect if there are any query params
    if ([...searchParams.keys()].length === 0) return;

    const search = searchParams.get('search') ?? '';
    const ranges = searchParams.getAll('range');
    const city = searchParams.get('city') ?? '';

    const categoryRaw = searchParams.get('category') ?? '';
    const category = categoryRaw ? categoryRaw.split(',').filter(Boolean) : [];

    const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;
    const limit = parseInt(searchParams.get('limit') ?? '10', 10) || 10;

    // prefer 'sort' but also accept 'sortBy' for compatibility
    const sort = searchParams.get('sort') ?? searchParams.get('sortBy') ?? 'recent';

    const tagsRaw = searchParams.get('tags') ?? '';
    const tags = tagsRaw ? tagsRaw.split(',').filter(Boolean) : [];

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const date = searchParams.get('date') ?? null;
    const ratingRaw = searchParams.get('rating');
    const rating =
      ratingRaw != null ? (Number.isNaN(Number(ratingRaw)) ? null : Number(ratingRaw)) : null;

    const parsedFilters = {
      range: ranges || [],
      city: city,
      category: category,
      tags: tags,
      minPrice: minPrice != null ? Number(minPrice) : null,
      maxPrice: maxPrice != null ? Number(maxPrice) : null,
    };

    const titleOnly = (searchParams.get('titleOnly') ?? '') === 'true';
    const exact = (searchParams.get('exact') ?? searchParams.get('exactWords') ?? '') === 'true';

    // Apply to store (only once)
    dispatch(setSearch(search));
    dispatch(setFilters(parsedFilters));
    dispatch(setSortBy(sort));
    dispatch(setDate(date));
    dispatch(setRating(rating));
    // Note: date is not stored in redux filters; it's sent directly to the backend via fetch
    dispatch(setPaginaActual(page));
    dispatch(setRegistrosPorPagina(limit));
    dispatch(setTitleOnly(titleOnly));
    dispatch(setExact(exact));
    appliedRef.current = true;

    // Trigger the fetch with the parsed params
    dispatch(
      fetchOffers({
        searchText: search,
        filters: parsedFilters,
        sortBy: sort,
        date: date || undefined,
        rating: rating ?? undefined,
        page,
        limit,
        titleOnly,
        exact,
      }),
    );
  }, [dispatch]);
};

export default useApplyQueryToStore;
