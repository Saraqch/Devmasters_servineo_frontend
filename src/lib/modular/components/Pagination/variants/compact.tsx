// src/lib/modular/components/Pagination/variants/compact.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '@/lib/modular/hooks';
import { PaginationHeadless } from '@/lib/modular/headless';
import { PaginationProps } from '../Pagination';
import { registerPaginationVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PaginationCompact = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalItems, pageSize, onPageChange, maxVisible = 3, className }, ref) => {
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
          <div ref={ref} className={cn('flex items-center gap-1', className)}>
            <Button
              onClick={navigation.prevPage}
              disabled={!state.hasPrev}
              variant="ghost"
              size="icon-sm"
            >
              <ChevronLeft size={14} />
            </Button>

            {pages.map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  onClick={() => navigation.goToPage(page)}
                  variant={page === pagination.currentPage ? 'default' : 'ghost'}
                  size="icon-sm"
                  className="text-xs"
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              onClick={navigation.nextPage}
              disabled={!state.hasNext}
              variant="ghost"
              size="icon-sm"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </PaginationHeadless>
    );
  },
);

PaginationCompact.displayName = 'PaginationCompact';

registerPaginationVariant('compact', PaginationCompact);
