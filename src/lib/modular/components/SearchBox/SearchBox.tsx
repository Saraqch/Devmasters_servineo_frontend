// src/lib/modular/components/SearchBox/SearchBox.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getSearchVariant, SearchBoxVariantName } from './registry';

export interface SearchBoxProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  debounceMs?: number;
  variant?: SearchBoxVariantName;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  searchButtonText?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchBox = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  ({ variant = 'default', ...props }, ref) => {
    const Component = getSearchVariant(variant);

    if (!Component) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`SearchBox: variant "${variant}" no está registrado.`);
      }
      return null;
    }

    return <Component {...props} ref={ref} />;
  },
);

SearchBox.displayName = 'SearchBox';


