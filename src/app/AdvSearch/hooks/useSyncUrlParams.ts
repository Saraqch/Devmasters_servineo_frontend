// src/app/AdvSearch/hooks/useSyncUrlParamsAdv.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { MutableRefObject } from 'react';

interface Params {
  search?: string;
  filters?: { range?: string[]; city?: string; category?: string[]; tags?: string[]; minPrice?: number | null; maxPrice?: number | null };
  titleOnly?: boolean;
  exact?: boolean;
  date?: string | null;
  sortBy?: string | null;
  page?: number;
  limit?: number;
  // optional ref to temporarily skip syncing (set true before navigation)
  skipSyncRef?: MutableRefObject<boolean | null>;
}

export const useSyncUrlParamsAdv = (p: Params) => {
  const router = useRouter();
  // Destructure once so we can use stable primitives in deps
  const { search, filters, titleOnly, exact, date, sortBy, page, limit, skipSyncRef } = p;
  const filtersJson = JSON.stringify(filters || {});

  useEffect(() => {
    // If parent signals skipping sync (e.g. about to navigate), consume the flag and skip one run
    if (skipSyncRef && skipSyncRef.current) {
      // reset flag and skip this sync to avoid overriding navigation
      skipSyncRef.current = false;
      return;
    }

    const hasAny = !!(
      (search && search.trim() !== '') ||
      titleOnly ||
      exact ||
      (date && date.trim() !== '') ||
      (sortBy && sortBy.trim() !== '') ||
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
  if (date) params.set('date', date);
  if (sortBy) params.set('sort', sortBy);
    if (page != null) params.set('page', String(page));
    if (limit != null) params.set('limit', String(limit));

    const qs = params.toString();
    // Use relative query update like jobOfert: replace only the search part (keeps pathname)
    const targetSearch = qs ? `?${qs}` : '';

    // If nothing is active, ensure the search is cleared
    if (!hasAny) {
      if (typeof window !== 'undefined' && window.location.search === '') return;
      router.replace(targetSearch, { scroll: false });
      if (typeof window !== 'undefined' && window.location.search !== targetSearch) {
        try { window.history.replaceState(null, '', window.location.pathname + targetSearch); } catch { /* noop */ }
      }
      return;
    }

    // Avoid replacing if search already matches target (prevents unnecessary navigation)
    if (typeof window !== 'undefined' && window.location.search === targetSearch) return;

    // update Next router and ensure browser address bar shows the search
    router.replace(targetSearch, { scroll: false });
    if (typeof window !== 'undefined' && window.location.search !== targetSearch) {
      try { window.history.replaceState(null, '', window.location.pathname + targetSearch); } catch { /* noop */ }
    }
  // Use stable primitive deps to avoid re-running on new object identity
  }, [search, titleOnly, exact, date, sortBy, page, limit, filtersJson, router, skipSyncRef,
    // include specific filter fields to satisfy linting (stable primitives)
    (filters && filters.range) || null,
    (filters && filters.category) || null,
    (filters && filters.city) || null,
    (filters && filters.tags) || null,
    (filters && filters.minPrice) || null,
    (filters && filters.maxPrice) || null,
  ]);
};
export default useSyncUrlParamsAdv;