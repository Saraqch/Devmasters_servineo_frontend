//src/lib/modular/headless/PaginationHeadless.tsx
import React from 'react';

export interface PaginationHeadlessProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  maxVisible?: number;
  children: (props: {
    pages: Array<number | 'ellipsis'>;
    currentPage: number;
    totalPages: number;
    navigation: {
      goToPage: (page: number) => void;
      nextPage: () => void;
      prevPage: () => void;
      firstPage: () => void;
      lastPage: () => void;
    };
    state: {
      hasNext: boolean;
      hasPrev: boolean;
      isFirstPage: boolean;
      isLastPage: boolean;
    };
  }) => React.ReactNode;
}

export function PaginationHeadless({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  maxVisible = 5,
  children,
}: PaginationHeadlessProps) {
  const getPages = (): Array<number | 'ellipsis'> => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | 'ellipsis'> = [1];

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = Math.min(maxVisible - 1, totalPages - 1);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - maxVisible + 2);
    }

    if (start > 2) {
      pages.push('ellipsis');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      {children({
        pages: getPages(),
        currentPage,
        totalPages,
        navigation: {
          goToPage: onPageChange,
          nextPage: () => onPageChange(currentPage + 1),
          prevPage: () => onPageChange(currentPage - 1),
          firstPage: () => onPageChange(1),
          lastPage: () => onPageChange(totalPages),
        },
        state: {
          hasNext,
          hasPrev,
          isFirstPage: currentPage === 1,
          isLastPage: currentPage === totalPages,
        },
      })}
    </>
  );
}
