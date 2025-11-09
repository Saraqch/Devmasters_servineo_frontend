'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from './hook';
import { fetchOffers } from '../lib/slice';

type FilterParamValue = string | string[] | number | boolean | null;
type ParamsMap = Record<string, FilterParamValue>;

export default function useAppliedFilters() {
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [appliedParams, setAppliedParams] = useState<ParamsMap | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const registrosPorPagina = useAppSelector((s) => s.jobOffers.registrosPorPagina);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const fromAdvStorage = (() => {
        try {
          return window.sessionStorage.getItem('fromAdv');
        } catch {
          return null;
        }
      })();

      const sp = new URLSearchParams(window.location.search);
      const fromAdv = fromAdvStorage ?? sp.get('fromAdv');
      if (fromAdv === 'true') {
        try {
          window.sessionStorage.removeItem('fromAdv');
        } catch {
          // ignore
        }

        const params: ParamsMap = {};
        const keys = [
          'search',
          'titleOnly',
          'exact',
          'tags',
          'category',
          'city',
          'minPrice',
          'maxPrice',
          'range',
          'date',
          'sortBy',
          'rating',
        ];
        keys.forEach((k) => {
          const val = sp.get(k);
          if (val == null) return;
          if (k === 'tags' || k === 'category' || k === 'range') {
            params[k] = val.split(',').filter(Boolean);
          } else if (k === 'titleOnly' || k === 'exact') {
            params[k] = val === 'true';
          } else if (k === 'minPrice' || k === 'maxPrice') {
            const n = Number(val);
            params[k] = Number.isNaN(n) ? null : n;
          } else if (k === 'date') {
            // keep raw date string (YYYY-MM-DD) => display handled by AppliedFilters
            params[k] = val;
          } else if (k === 'rating') {
            const r = Number(val);
            params[k] = Number.isNaN(r) ? null : r;
          } else {
            params[k] = val;
          }
        });

        setAppliedParams(params);
        setShowAppliedFilters(true);
      }
    } catch {
      // ignore
    }
    // run once on mount
  }, []);

  const handleClearApplied = () => {
    setShowAppliedFilters(false);
    setAppliedParams(null);
    if (typeof window !== 'undefined') {
      // Don't force navigation to /jobOfert. Instead replace the current URL
      // with the same pathname (clearing query params) so we stay on the
      // current page (e.g. resultsAdvSearch) while removing filters from URL.
      try {
        const path = window.location.pathname || '/';
        router.replace(path);
      } catch {
        // ignore router errors
      }
    }
    // trigger a default fetch
    dispatch(
      fetchOffers({
        searchText: '',
        filters: { range: [], city: '', category: [] },
        sortBy: 'recent',
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  return { showAppliedFilters, appliedParams, handleClearApplied };
}
