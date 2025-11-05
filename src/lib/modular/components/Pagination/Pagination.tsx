// src/lib/modular/components/Pagination/Pagination.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getPaginationVariant, PaginationVariantName } from './registry';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
  variant?: PaginationVariantName;
  className?: string;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ variant = 'default', ...props }, ref) => {
    const Component = getPaginationVariant(variant);

    if (!Component) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Pagination: variant "${variant}" no está registrado.`);
      }
      return null;
    }

    return <Component {...props} ref={ref} />;
  },
);

Pagination.displayName = 'Pagination';
