// src/lib/modular/components/SearchBox/variants/compact.tsx
'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/lib/modular/hooks';
import { SearchBoxHeadless } from '@/lib/modular/headless';
import { SearchBoxProps } from '../SearchBox';
import { registerSearchVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SearchBoxCompact = React.forwardRef<HTMLDivElement, SearchBoxProps>(
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
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
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
        {({ inputProps, submitButtonProps }) => (
          <div ref={ref} className={cn('flex gap-1', className)}>
            <input
              {...inputProps}
              className={cn(
                'flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                sizeClasses[size],
              )}
            />
            <Button {...submitButtonProps} size="icon" className={cn(sizeClasses[size])}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SearchBoxHeadless>
    );
  },
);

SearchBoxCompact.displayName = 'SearchBoxCompact';

registerSearchVariant('compact', SearchBoxCompact);
