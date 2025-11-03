// src/app/jobOfert/components_jo/Search/SearchBar.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { SearchButton } from './SearchButton';
import { useSearch } from '@/lib/modular/hooks';
import { SearchBoxHeadless } from '@/lib/modular/headless';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  // ✅ Hook para lógica
  const search = useSearch({
    initialValue: '',
    config: {
      minLength: 2,
      maxLength: 100,
      debounceMs: 300,
      regex:
        /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/,
    },
    onSubmit: onSearch,
  });

  return (
    // ✅ Headless para estructura
    <SearchBoxHeadless
      value={search.value}
      onChange={search.setValue}
      onSubmit={search.submit}
      onClear={search.clear}
      error={search.error}
      placeholder="¿Qué servicio necesitas?"
    >
      {({ inputProps, clearButtonProps, submitButtonProps, state }) => {
        const hasError = state.hasError;
        const inputClasses = `pl-10 ${state.hasValue ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded ${
          hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
        }`;

        return (
          <div className="w-full">
            {/* 🎨 Diseño específico de JobOfert */}
            <div className="flex flex-col w-full sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon hasError={hasError} />
                <Input {...inputProps} className={inputClasses} />
                {state.hasValue && <ClearButton {...clearButtonProps} />}
              </div>
              <SearchButton {...submitButtonProps} />
            </div>

            {/* Error message */}
            <div className="h-2 mt-1">
              {state.hasError && <p className="text-red-500 text-sm">{state.error}</p>}
            </div>
          </div>
        );
      }}
    </SearchBoxHeadless>
  );
};
