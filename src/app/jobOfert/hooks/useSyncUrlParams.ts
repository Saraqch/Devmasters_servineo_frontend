import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterState } from '../lib/slice';

interface UseSyncUrlParamsProps {
  search: string;
  filters: FilterState;
  sortBy: string;
  paginaActual: number;
  registrosPorPagina: number;
}

export const useSyncUrlParams = ({
  search,
  filters,
  sortBy,
  paginaActual,
  registrosPorPagina,
}: UseSyncUrlParamsProps) => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (filters.city) params.set('city', filters.city);
    if (filters.range?.length) params.set('range', filters.range.join(','));
    if (filters.category?.length) params.set('category', filters.category.join(','));
    if (sortBy) params.set('sort', sortBy);
    if (paginaActual) params.set('page', String(paginaActual));
    if (registrosPorPagina) params.set('limit', String(registrosPorPagina));

    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : '', { scroll: false });
  }, [search, filters, sortBy, paginaActual, registrosPorPagina, router]);
};