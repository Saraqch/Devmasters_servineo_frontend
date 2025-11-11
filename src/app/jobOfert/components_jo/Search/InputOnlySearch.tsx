'use client';

import React from 'react';
import { Input } from '@/Components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { validateSearch } from '../../validators/search.validator';

interface InputOnlySearchProps {
  onSearch: (query: string) => void;
  onValueChange?: (value: string) => void;
}

export const InputOnlySearch = ({ onSearch, onValueChange }: InputOnlySearchProps) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  // On mount, if there's a `search` query param (coming from AdvSearch "Modificar"), populate the input
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get('search');
      if (s && s.length && value === '') {
        setValue(s);
        if (typeof onValueChange === 'function') onValueChange(s);
      }
    } catch {
      // ignore
    }
    // run once
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (typeof onValueChange === 'function') onValueChange(e.target.value);
    const { isValid, error } = validateSearch(e.target.value);
    setError(isValid ? undefined : error);
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    // Only clear the input value locally and notify parent of the value change.
    // Do NOT trigger a search/navigation here.
    if (typeof onValueChange === 'function') onValueChange('');
  };

  const handleSearch = () => {
    const { isValid, error, data } = validateSearch(value);
    if (!isValid) {
      setError(error);
      return;
    }
    onSearch(data!);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const hasError = !!error;
  const inputClasses = `pl-10 ${value.length > 0 ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded ${
    hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
  }`;

  return (
    <div className="w-full">
      <div className="relative">
        <SearchIcon hasError={hasError} />
        <Input
          type="text"
          placeholder="¿Qué servicio necesitas?"
          className={inputClasses}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {value.length > 0 && <ClearButton onClick={handleClear} />}
      </div>
      <div className="h-2 mt-1">{hasError && <p className="text-red-500 text-sm">{error}</p>}</div>
    </div>
  );
};
