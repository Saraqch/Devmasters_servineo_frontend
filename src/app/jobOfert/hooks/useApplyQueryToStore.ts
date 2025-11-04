import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from './hook';
import {
  setSearch,
  setFilters,
  setSortBy,
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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const appliedRef = useRef(false);

  useEffect(() => {
  if (!searchParams) return;
  // Only apply once to avoid loops between reading URL -> dispatch -> syncURL hooks
  if (appliedRef.current) return;

  // detect if there are any query params
  const hasAny = [...searchParams.keys()].length > 0;
  if (!hasAny) return;

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
        page,
        limit,
        titleOnly,
        exact,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString(), dispatch]);
};

export default useApplyQueryToStore;
