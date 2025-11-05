// src/lib/modular/components/SearchBox/variants/default.tsx
'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/lib/modular/hooks';
import { SearchBoxHeadless } from '@/lib/modular/headless';
import { SearchBoxProps } from '../SearchBox';
import { registerSearchVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SearchBoxDefault = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  (
    {
      onSearch,
      initialValue = '',
      placeholder = '¿Qué estás buscando?',
      minLength = 2,
      maxLength = 100,
      regex,
      debounceMs = 300,
      size = 'md',
      showClearButton = true,
      searchButtonText = 'Buscar',
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
      sm: { input: 'h-8 text-sm', button: 'h-8 px-3 text-sm', icon: 16 },
      md: { input: 'h-10 text-base', button: 'h-10 px-4 text-base', icon: 20 },
      lg: { input: 'h-12 text-lg', button: 'h-12 px-6 text-lg', icon: 24 },
    };

    const currentSize = sizeClasses[size];

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
        {({ inputProps, clearButtonProps, submitButtonProps, state }) => (
          <div ref={ref} className={cn('w-full', className)}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Search
                    size={currentSize.icon}
                    className={cn(
                      'transition-colors',
                      state.hasError ? 'text-red-500' : 'text-muted-foreground',
                    )}
                  />
                </span>

                <Input
                  {...inputProps}
                  className={cn(
                    'pl-10',
                    state.hasValue && showClearButton ? 'pr-10' : 'pr-3',
                    currentSize.input,
                    state.hasError && 'border-red-500 focus-visible:ring-red-500',
                  )}
                />

                {state.hasValue && showClearButton && (
                  <button
                    {...clearButtonProps}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={currentSize.icon} />
                  </button>
                )}
              </div>

              <Button {...submitButtonProps} className={cn('w-full sm:w-auto', currentSize.button)}>
                {searchButtonText}
              </Button>
            </div>

            {state.hasError && <p className="text-red-500 text-sm mt-1">{state.error}</p>}
          </div>
        )}
      </SearchBoxHeadless>
    );
  },
);

SearchBoxDefault.displayName = 'SearchBoxDefault';

registerSearchVariant('default', SearchBoxDefault);
