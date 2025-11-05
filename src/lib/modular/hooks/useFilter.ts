// src/lib/modular/hooks/useFilter.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseFilterOptions<T = any> {
  initialFilters?: T;
  autoApply?: boolean;
  onChange?: (filters: T) => void;
  onApply?: (filters: T) => void;
  defaultOpenSections?: string[];
  /**
   * Defines the empty state structure for each filter key.
   * Used when resetting filters to ensure correct data types.
   * 
   * @example
   * resetStructure: {
   *   categories: [], // Array filters reset to empty array
   *   search: '',     // String filters reset to empty string
   *   status: undefined, // Single select resets to undefined
   * }
   */
  resetStructure?: Partial<T>;
}

export function useFilter<T extends Record<string, any>>(
  options: UseFilterOptions<T> = {}
) {
  const {
    initialFilters = {} as T,
    autoApply = false,
    onChange,
    onApply,
    defaultOpenSections = [],
    resetStructure,
  } = options;

  const [filters, setFilters] = useState<T>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<T>(initialFilters);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    defaultOpenSections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );

  const filtersRef = useRef<T>(initialFilters);
  const initialFiltersRef = useRef<T>(initialFilters);
  const resetStructureRef = useRef<Partial<T> | undefined>(resetStructure);
  const onApplyRef = useRef(onApply);
  const onChangeRef = useRef(onChange);

  // Update refs when callbacks change
  useEffect(() => {
    onApplyRef.current = onApply;
  }, [onApply]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update initialFiltersRef when initialFilters change
  useEffect(() => {
    initialFiltersRef.current = initialFilters;
  }, [initialFilters]);

  // Update resetStructureRef when resetStructure changes
  useEffect(() => {
    resetStructureRef.current = resetStructure;
  }, [resetStructure]);

  // Auto-apply filters when autoApply is enabled
  useEffect(() => {
    if (autoApply && JSON.stringify(filters) !== JSON.stringify(appliedFilters)) {
      const timeoutId = setTimeout(() => {
        setAppliedFilters(filters);
        onApplyRef.current?.(filters);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, appliedFilters, autoApply]);

  filtersRef.current = filters;

  const toggleSection = useCallback((sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }, []);

  const openAllSections = useCallback((sections: string[]) => {
    setOpenSections(sections.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  }, []);

  const closeAllSections = useCallback(() => {
    setOpenSections({});
  }, []);

  const updateFilter = useCallback(
    (key: keyof T, value: any) => {
      setFilters((prev) => {
        const updated = { ...prev, [key]: value };
        filtersRef.current = updated;
        onChangeRef.current?.(updated);
        return updated;
      });
    },
    []
  );

  const updateMultiple = useCallback(
    (updates: Partial<T>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...updates };
        filtersRef.current = updated;
        onChangeRef.current?.(updated);
        return updated;
      });
    },
    []
  );

  const applyFilters = useCallback(
    (explicitFilters?: T) => {
      const toApply = explicitFilters ?? filtersRef.current;
      setAppliedFilters(toApply);
      setTimeout(() => {
        onApplyRef.current?.(toApply);
      }, 0);
    },
    []
  );

  /**
   * Creates an empty filter structure based on resetStructure or current filter types
   */
  const createEmptyFilters = useCallback((): T => {
    // If resetStructure is provided, use it
    if (resetStructureRef.current) {
      return { ...filtersRef.current, ...resetStructureRef.current } as T;
    }

    // Otherwise, infer from current filter values
    const emptyFilters = Object.keys(filtersRef.current).reduce(
      (acc, key) => {
        const currentValue = filtersRef.current[key];
        return {
          ...acc,
          [key]: Array.isArray(currentValue) ? [] : undefined,
        };
      },
      {} as T,
    );

    return emptyFilters;
  }, []);

  const reset = useCallback(
    (newInitial?: T) => {
      let resetTo: T;

      if (newInitial !== undefined) {
        // Use explicitly provided reset value
        resetTo = newInitial;
      } else {
        // Create empty filters based on structure
        resetTo = createEmptyFilters();
      }
      
      setFilters(resetTo);
      filtersRef.current = resetTo;
      setAppliedFilters(resetTo);

      // Call callbacks in the next tick
      setTimeout(() => {
        onChangeRef.current?.(resetTo);
        onApplyRef.current?.(resetTo);
      }, 0);
    },
    [createEmptyFilters]
  );

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  const hasActiveFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== undefined
  );

  return {
    filters,
    appliedFilters,
    openSections,
    updateFilter,
    updateMultiple,
    applyFilters,
    reset,
    toggleSection,
    openAllSections,
    closeAllSections,
    hasChanges,
    hasActiveFilters,
    autoApply,
  };
}