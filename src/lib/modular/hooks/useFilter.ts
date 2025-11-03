// src/lib/modular/hooks/useFilter.ts
import { useState, useCallback, useRef } from 'react';

export interface UseFilterOptions<T = any> {
  initialFilters?: T;
  onChange?: (filters: T) => void;
  onApply?: (filters: T) => void;
}

export function useFilter<T extends Record<string, any>>(options: UseFilterOptions<T> = {}) {
  const {
    initialFilters = {} as T,
    onChange,
    onApply,
  } = options;

  const [filters, setFilters] = useState<T>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<T>(initialFilters);

  // Ref que siempre contiene la última versión de `filters`
  const filtersRef = useRef<T>(initialFilters);
  filtersRef.current = filters;

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      filtersRef.current = updated;
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  const updateMultiple = useCallback((updates: Partial<T>) => {
    setFilters(prev => {
      const updated = { ...prev, ...updates };
      filtersRef.current = updated;
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  // applyFilters usa siempre la ref para asegurarse que aplica el último estado.
  const applyFilters = useCallback((explicitFilters?: T) => {
    const toApply = explicitFilters ?? filtersRef.current;
    setAppliedFilters(toApply);
    onApply?.(toApply);
  }, [onApply]);

  const reset = useCallback((newInitial?: T) => {
    const resetTo = newInitial ?? initialFilters;
    // actualizar estado y ref en un solo sitio
    setFilters(resetTo);
    filtersRef.current = resetTo;
    setAppliedFilters(resetTo);
    onChange?.(resetTo);
    onApply?.(resetTo);
  }, [initialFilters, onChange, onApply]);

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== undefined
  );

  return {
    filters,
    appliedFilters,
    updateFilter,
    updateMultiple,
    applyFilters,
    reset,
    hasChanges,
    hasActiveFilters,
  };
}
