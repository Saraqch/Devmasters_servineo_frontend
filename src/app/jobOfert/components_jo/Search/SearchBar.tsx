import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { SearchButton } from './SearchButton';
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
  }`
  
return (
  <div className="w-full">
    <div className="flex flex-col w-full sm:flex-row sm:items-center gap-2">
      <div className="relative flex-1">
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
      <SearchButton disabled={!!hasError || value.length === 0} onClick={handleSearch} />
    </div>
    <div className="h-6 mt-1">{hasError && <p className="text-red-500 text-sm">{error}</p>}</div>
  </div>
);
};
