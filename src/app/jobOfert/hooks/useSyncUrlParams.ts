'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterState } from '../lib/slice';

interface UseSyncUrlParamsProps {
  search: string;
  filters: FilterState;
  sortBy: string;
  // optional date from redux (YYYY-MM-DD)
  date?: string | null;
  // optional rating from redux (integer 1..5)
  rating?: number | null;
  paginaActual: number;
  registrosPorPagina: number;
  titleOnly?: boolean;
  exact?: boolean;
}

export const useSyncUrlParams = ({
  search,
  filters,
  sortBy,
  date,
  rating,
  paginaActual,
  registrosPorPagina,
  titleOnly,
  exact,
}: UseSyncUrlParamsProps) => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (titleOnly) params.set('titleOnly', 'true');
    if (exact) params.set('exact', 'true');
    if (filters?.range?.length) filters.range.forEach((r) => params.append('range', r));
    if (filters?.city) params.set('city', filters.city);
    if (filters?.category?.length) params.set('category', filters.category.join(','));
    if (filters?.tags?.length) params.set('tags', filters.tags.join(','));
    if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.range?.length) params.append('range', filters.range.join(','));
    if (sortBy) params.set('sort', sortBy);
    // include date from redux/store when present so it is not lost
    if (date) params.set('date', date);
    // include rating when present
    if (rating != null) params.set('rating', String(rating));
    if (paginaActual) params.set('page', String(paginaActual));
    if (registrosPorPagina) params.set('limit', String(registrosPorPagina));

    const queryString = params.toString();
    const target = queryString ? `?${queryString}` : '';

    // Avoid unnecessary router.replace which can retrigger URL listeners
    if (typeof window !== 'undefined' && window.location.search === target) return;

    router.replace(target, { scroll: false });
  }, [
    search,
    filters,
    sortBy,
    date,
    rating,
    paginaActual,
    registrosPorPagina,
    titleOnly,
    exact,
    router,
  ]);
};
