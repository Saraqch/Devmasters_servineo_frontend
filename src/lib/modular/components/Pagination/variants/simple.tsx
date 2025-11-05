// src/lib/modular/components/Pagination/variants/simple.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '@/lib/modular/hooks';
import { PaginationProps } from '../Pagination';
import { registerPaginationVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PaginationSimple = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalItems, pageSize, onPageChange, className }, ref) => {
    const pagination = usePagination({
      totalItems,
      initialPage: currentPage,
      initialPageSize: pageSize,
    });

    return (
      <div ref={ref} className={cn('flex items-center justify-between', className)}>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          variant="outline"
          size="sm"
        >
          <ChevronLeft size={16} className="mr-1" />
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          Página {pagination.currentPage} de {pagination.totalPages}
        </span>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          variant="outline"
          size="sm"
        >
          Siguiente
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    );
  },
);

PaginationSimple.displayName = 'PaginationSimple';

registerPaginationVariant('simple', PaginationSimple);
