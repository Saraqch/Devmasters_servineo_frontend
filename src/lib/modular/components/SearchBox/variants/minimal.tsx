// src/lib/modular/components/SearchBox/variants/minimal.tsx
'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/lib/modular/hooks';
import { SearchBoxHeadless } from '@/lib/modular/headless';
import { SearchBoxProps } from '../SearchBox';
import { registerSearchVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SearchBoxMinimal = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  (
    {
      onSearch,
      initialValue = '',
      placeholder = 'Buscar...',
      minLength = 2,
      maxLength = 100,
      regex,
      debounceMs = 300,
      size = 'md',
      className,
      disabled = false,
    },
    ref,
  ) => {
    const search = useSearch({
      initialValue,
      config: { minLength, maxLength, regex, debounceMs },
      onSubmit: onSearch,
    });

    const sizeClasses = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    };

    return (
      <SearchBoxHeadless
        value={search.value}
        onChange={search.setValue}
        onSubmit={search.submit}
        onClear={search.clear}
        error={search.error}
        disabled={disabled}
        placeholder={placeholder}
      >
        {({ inputProps, state }) => (
          <div ref={ref} className={cn('w-full', className)}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...inputProps}
                className={cn('pl-9 pr-3', sizeClasses[size], state.hasError && 'border-red-500')}
              />
            </div>
            {state.hasError && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
          </div>
        )}
      </SearchBoxHeadless>
    );
  },
);

SearchBoxMinimal.displayName = 'SearchBoxMinimal';

registerSearchVariant('minimal', SearchBoxMinimal);