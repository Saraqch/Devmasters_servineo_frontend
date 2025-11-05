// src/lib/modular/components/PageSizeSelector/PageSizeSelector.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getPageSizeVariant, PageSizeSelectorVariantName } from './registry';

export interface PageSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  label?: string;
  variant?: PageSizeSelectorVariantName;
  className?: string;
}

export const PageSizeSelector = React.forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ variant = 'select', ...props }, ref) => {
    const Component = getPageSizeVariant(variant);

    if (!Component) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`PageSizeSelector: variant "${variant}" no está registrado.`);
      }
      return null;
    }

    return <Component {...props} ref={ref} />;
  },
);

PageSizeSelector.displayName = 'PageSizeSelector';
