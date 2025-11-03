// src/lib/modular/headless/FilterPanelHeadless.tsx
import React from 'react';
import { FilterConfig, FilterOption } from '../types/base.types';

export interface FilterPanelHeadlessProps<T> {
  filters: T;
  config: FilterConfig[];
  onChange: (key: keyof T, value: any) => void;
  onApply?: () => void;
  onReset?: () => void;
  hasChanges?: boolean;
  children: (props: {
    filterGroups: Array<{
      config: FilterConfig;
      value: any;
      options: Array<{
        option: FilterOption;
        isSelected: boolean;
        toggle: () => void;
      }>;
    }>;
    actions: {
      apply: () => void;
      reset: () => void;
      canApply: boolean;
    };
  }) => React.ReactNode;
}

export function FilterPanelHeadless<T extends Record<string, any>>({
  filters,
  config,
  onChange,
  onApply,
  onReset,
  hasChanges = false,
  children,
}: FilterPanelHeadlessProps<T>) {
  const filterGroups = config.map((filterConfig) => {
    // defensivo: si no hay valor inicial, normalizamos
    let currentValue = filters[filterConfig.key];
    // Si es checkbox múltiple y viene undefined, tratamos como []
    if (filterConfig.type === 'checkbox' && filterConfig.multiple !== false) {
      if (!Array.isArray(currentValue)) currentValue = [];
    }

    const options = (filterConfig.options || []).map((option) => {
      const isSelected = Array.isArray(currentValue)
        ? currentValue.includes(option.value)
        : currentValue === option.value;

      const toggle = () => {
        // Checkbox multiple (array)
        if (filterConfig.type === 'checkbox' && filterConfig.multiple !== false) {
          const base = Array.isArray(currentValue) ? currentValue.slice() : [];
          const newValue = isSelected
            ? base.filter((v: any) => v !== option.value)
            : [...base, option.value];
          onChange(filterConfig.key as keyof T, newValue);
          return;
        }

        // Checkbox single -> togglear entre valor y empty string (o null)
        if (filterConfig.type === 'checkbox' && filterConfig.multiple === false) {
          const newValue = isSelected ? '' : option.value;
          onChange(filterConfig.key as keyof T, newValue);
          return;
        }

        // Radio
        if (filterConfig.type === 'radio') {
          onChange(filterConfig.key as keyof T, isSelected ? '' : option.value);
          return;
        }

        // Default: setear el valor
        onChange(filterConfig.key as keyof T, option.value);
      };

      return { option, isSelected, toggle };
    });

    return {
      config: filterConfig,
      value: currentValue,
      options,
    };
  });

  return (
    <>
      {children({
        filterGroups,
        actions: {
          apply: () => onApply?.(),
          reset: () => onReset?.(),
          canApply: hasChanges,
        },
      })}
    </>
  );
}
