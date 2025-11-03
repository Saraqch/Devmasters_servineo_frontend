// src/lib/modular/hooks/useSearch.ts
import { useState, useCallback, useEffect } from 'react';
import { SearchConfig } from '../types/base.types';

export interface UseSearchOptions {
  initialValue?: string;
  config?: SearchConfig;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    initialValue = '',
    config = {},
    onChange,
    onSubmit,
  } = options;

  const [searchValue, setSearchValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, config.debounceMs || 0);

    return () => clearTimeout(timer);
  }, [searchValue, config.debounceMs]);

  // Validación
  const validate = useCallback((value: string): boolean => {
    if (config.minLength && value.length > 0 && value.length < config.minLength) {
      setError(`Mínimo ${config.minLength} caracteres`);
      return false;
    }
    if (config.maxLength && value.length > config.maxLength) {
      setError(`Máximo ${config.maxLength} caracteres`);
      return false;
    }
    if (config.regex && value && !config.regex.test(value)) {
      setError('Formato inválido');
      return false;
    }
    setError(null);
    return true;
  }, [config]);

  const handleChange = useCallback((value: string) => {
    setSearchValue(value);
    validate(value);
    onChange?.(value);
  }, [validate, onChange]);

  const handleSubmit = useCallback(() => {
    if (validate(searchValue)) {
      onSubmit?.(searchValue);
    }
  }, [searchValue, validate, onSubmit]);

  const clear = useCallback(() => {
    setSearchValue('');
    setError(null);
    onChange?.('');
  }, [onChange]);

  return {
    value: searchValue,
    debouncedValue,
    error,
    setValue: handleChange,
    submit: handleSubmit,
    clear,
    isValid: !error && searchValue.length >= (config.minLength || 0),
  };
}