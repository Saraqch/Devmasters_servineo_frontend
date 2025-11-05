import React from 'react';
import { cn } from '@/lib/utils';
import { getSortVariant, SortSelectVariantName } from './registry';
import type { SortOption } from '@/lib/modular/types/base.types';

export interface SortSelectProps {
  options: SortOption[];
  value?: string;
  onChange: (value: string) => void;
  variant?: SortSelectVariantName;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const SortSelect = React.forwardRef<HTMLDivElement, SortSelectProps>(
  ({ variant = 'dropdown', ...props }, ref) => {
    const Component = getSortVariant(variant);

    if (!Component) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`SortSelect: variant "${variant}" no está registrado.`);
      }
      return null;
    }

    return <Component {...props} ref={ref} />;
  },
);

SortSelect.displayName = 'SortSelect';
