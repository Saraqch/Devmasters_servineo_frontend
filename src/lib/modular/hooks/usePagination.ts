//src/lib/modular/hooks/usePagination.ts
import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationOptions {
  totalItems?: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const {
    totalItems = 0,
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    onChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => 
    Math.max(Math.ceil(totalItems / pageSize), 1),
    [totalItems, pageSize]
  );

  const startIndex = useMemo(() => 
    (currentPage - 1) * pageSize + 1,
    [currentPage, pageSize]
  );

  const endIndex = useMemo(() => 
    Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    onChange?.(validPage, pageSize);
  }, [totalPages, pageSize, onChange]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    onChange?.(1, newSize);
  }, [onChange]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
    onChange?.(1, initialPageSize);
  }, [initialPageSize, onChange]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    pageSizeOptions,
  };
}