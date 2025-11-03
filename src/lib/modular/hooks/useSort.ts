//src/lib/modular/hooks/useSort.ts
import { useState, useCallback } from 'react';
import { SortOption } from '../types/base.types';

export interface UseSortOptions {
  initialSort?: string;
  options?: SortOption[];
  onChange?: (sortValue: string) => void;
}

export function useSort(options: UseSortOptions = {}) {
  const {
    initialSort = '',
    options: sortOptions = [],
    onChange,
  } = options;

  const [sortValue, setSortValue] = useState(initialSort);

  const setSort = useCallback((value: string) => {
    setSortValue(value);
    onChange?.(value);
  }, [onChange]);

  const getCurrentLabel = useCallback(() => {
    return sortOptions.find(opt => opt.value === sortValue)?.label || '';
  }, [sortValue, sortOptions]);

  return {
    value: sortValue,
    setValue: setSort,
    label: getCurrentLabel(),
    options: sortOptions,
  };
}