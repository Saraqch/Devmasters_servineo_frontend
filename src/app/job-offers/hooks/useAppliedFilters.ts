'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './hook';
import { resetFilters } from '../lib/slice';

type FilterParamValue = string | string[] | number | boolean | null;
type ParamsMap = Record<string, FilterParamValue>;

export default function useAppliedFilters() {
  // Start without applied filters on first render to avoid hydration mismatches.
  const [showAppliedFilters, setShowAppliedFilters] = useState<boolean>(false);
  const [appliedParams, setAppliedParams] = useState<ParamsMap | null>(null);
  const dispatch = useAppDispatch();

  // First effect: Check for 'fromAdv' marker and parse URL params
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
          // Special-case `range`: it may appear multiple times in the query string
          if (k === 'range') {
            const all = sp.getAll('range') || [];
            if (all.length) {
              params[k] = all.filter(Boolean);
            }
            return;
          }

          const val = sp.get(k);
          if (val == null) return;
          if (k === 'tags' || k === 'category') {
            // these are encoded as a single, comma-separated value by AdvSearch
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
        try {
          // persist so refresh keeps the applied filters
          window.sessionStorage.setItem('appliedFilters', JSON.stringify(params));
          // remove the one-time marker
          window.sessionStorage.removeItem('fromAdv');
        } catch {
          // ignore
        }
      } else {
        // If not coming from AdvSearch, check if there are persisted applied filters
        try {
          const raw = window.sessionStorage.getItem('appliedFilters');
          if (raw) {
            const parsed = JSON.parse(raw) as ParamsMap;
            setAppliedParams(parsed);
            setShowAppliedFilters(true);
          }
        } catch {
          // ignore
        }
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
      try {
        window.sessionStorage.removeItem('appliedFilters');
      } catch {
        // ignore
      }
      // Do a full navigation to /job-offer without any query params
      window.location.href = '/job-offer';
    }
    // fetch will be triggered by the job-offer page on load after navigation
  };

  return { showAppliedFilters, appliedParams, handleClearApplied };
}
