'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './hook';
import { resetFilters } from '../lib/slice';

type FilterParamValue = string | string[] | number | boolean | null;
type ParamsMap = Record<string, FilterParamValue>;

export default function useAppliedFilters() {
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [appliedParams, setAppliedParams] = useState<ParamsMap | null>(null);
  const dispatch = useAppDispatch();

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
      // Reset filters in the store and persist (so URL sync will not re-add params)
      dispatch(resetFilters());
      // Do a full navigation to /jobOfert without any query params
      window.location.href = '/jobOfert';
    }
    // fetch will be triggered by the jobOfert page on load after navigation
  };

  return { showAppliedFilters, appliedParams, handleClearApplied };
}
