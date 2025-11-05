// src/lib/modular/components/Pagination/variants/default.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { usePagination } from '@/lib/modular/hooks';
import { PaginationHeadless } from '@/lib/modular/headless';
import { PaginationProps } from '../Pagination';
import { registerPaginationVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PaginationDefault = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalItems,
      pageSize,
      onPageChange,
      maxVisible = 5,
      showFirstLast = false,
      showInfo = false,
      className,
    },
    ref,
  ) => {
    const pagination = usePagination({
      totalItems,
      initialPage: currentPage,
      initialPageSize: pageSize,
    });

    return (
      <PaginationHeadless
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        maxVisible={maxVisible}
      >
        {({ pages, navigation, state }) => (
          <div ref={ref} className={cn('space-y-2', className)}>
            {showInfo && (
              <div className="text-sm text-muted-foreground text-center">
                Mostrando {pagination.startIndex} - {pagination.endIndex} de {totalItems} resultados
              </div>
            )}

            <div className="flex items-center justify-center gap-1">
              {showFirstLast && (
                <Button
                  onClick={navigation.firstPage}
                  disabled={state.isFirstPage}
                  variant="outline"
                  size="icon"
                >
                  <ChevronsLeft size={16} />
                </Button>
              )}

              <Button
                onClick={navigation.prevPage}
                disabled={!state.hasPrev}
                variant="outline"
                size="icon"
              >
                <ChevronLeft size={16} />
              </Button>

              {pages.map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    onClick={() => navigation.goToPage(page)}
                    variant={page === pagination.currentPage ? 'default' : 'outline'}
                    size="icon"
                  >
                    {page}
                  </Button>
                ),
              )}

              <Button
                onClick={navigation.nextPage}
                disabled={!state.hasNext}
                variant="outline"
                size="icon"
              >
                <ChevronRight size={16} />
              </Button>

              {showFirstLast && (
                <Button
                  onClick={navigation.lastPage}
                  disabled={state.isLastPage}
                  variant="outline"
                  size="icon"
                >
                  <ChevronsRight size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </PaginationHeadless>
    );
  },
);

PaginationDefault.displayName = 'PaginationDefault';

registerPaginationVariant('default', PaginationDefault);
