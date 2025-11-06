"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { SearchButton } from './SearchButton';
import { AdvancedSearchButton } from './AdvancedSearchButton';
import { validateSearch } from '../../validators/search.validator';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const { isValid, error } = validateSearch(e.target.value);
    setError(isValid ? undefined : error);
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    onSearch('');
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
  const inputClasses = `
    pl-10 
    ${value.length > 0 ? 'pr-10' : 'pr-3'} 
    w-full 
    h-10 sm:h-11
    text-sm sm:text-base
    rounded 
    ${hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''}
  `.trim();
  
  return (
    <div className="w-full">
      {/* Contenedor principal - SIEMPRE en fila horizontal */}
      <div className="flex flex-row items-stretch gap-2">
        
        {/* Input de búsqueda con iconos */}
        <div className="relative flex-1 min-w-0">
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

        {/* Botón Buscar */}
        <SearchButton onClick={handleSearch} />
        
        {/* Botón Búsqueda Avanzada */}
        <AdvancedSearchButton />
      </div>

      {/* Mensaje de error */}
      <div className="min-h-[1.5rem] mt-1">
        {hasError && (
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};