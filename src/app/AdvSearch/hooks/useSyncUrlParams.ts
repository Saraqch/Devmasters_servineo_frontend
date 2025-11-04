// src/app/AdvSearch/hooks/useSyncUrlParamsAdv.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Params {
  search?: string;
  filters?: { range?: string[]; city?: string; category?: string[]; tags?: string[]; minPrice?: number | null; maxPrice?: number | null };
  titleOnly?: boolean;
  exact?: boolean;
  page?: number;
  limit?: number;
}

export const useSyncUrlParamsAdv = (p: Params) => {
  const router = useRouter();
  useEffect(() => {
    const { search, filters, titleOnly, exact, page, limit } = p;

    const hasAny = !!(
      (search && search.trim() !== '') ||
      titleOnly ||
      exact ||
      (filters?.range && filters.range.length) ||
      (filters?.city) ||
      (filters?.category && filters.category.length) ||
      (filters?.tags && filters.tags.length) ||
      filters?.minPrice != null ||
      filters?.maxPrice != null
    );

    const params = new URLSearchParams();
    if (search && search.trim()) params.set('search', search.trim());
    if (titleOnly) params.set('titleOnly', 'true');
    if (exact) params.set('exact', 'true');
    filters?.range?.forEach(r => params.append('range', r));
    if (filters?.city) params.set('city', filters.city);
    if (filters?.category && filters.category.length) params.set('category', filters.category.join(','));
    if (filters?.tags && filters.tags.length) params.set('tags', filters.tags.join(','));
    if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    if (page != null) params.set('page', String(page));
    if (limit != null) params.set('limit', String(limit));

    const qs = params.toString();
    const target = qs ? `/AdvSearch?${qs}` : '/AdvSearch';

    // If nothing is active, ensure we remove params (go to /AdvSearch)
    if (!hasAny) {
      if (typeof window !== 'undefined' && window.location.pathname + window.location.search === '/AdvSearch') return;
      router.replace('/AdvSearch', { scroll: false });
      return;
    }

    // Avoid replacing if URL already matches target (prevents infinite replace loops)
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search === target) return;

    router.replace(target, { scroll: false });
  // Use stable primitive deps to avoid re-running on new object identity
  }, [p.search, p.titleOnly, p.exact, p.page, p.limit, JSON.stringify(p.filters), router]);
};
export default useSyncUrlParamsAdv;