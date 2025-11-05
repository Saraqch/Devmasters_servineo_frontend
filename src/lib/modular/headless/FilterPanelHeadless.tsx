// src/lib/modular/headless/FilterPanelHeadless.tsx
import React from 'react';
import { FilterConfig, FilterOption } from '../types/base.types';

export interface FilterPanelHeadlessProps<T> {
  filters: T;
  config: FilterConfig[];
  openSections?: Record<string, boolean>;
  onChange: (key: keyof T, value: any) => void;
  onToggleSection?: (key: string) => void;
  onApply?: () => void;
  onReset?: () => void;
  hasChanges?: boolean;
  children: (props: {
    filterGroups: Array<{
      config: FilterConfig;
      value: any;
      isOpen: boolean;
      columns: number;
      options: Array<{
        option: FilterOption;
        isSelected: boolean;
        toggle: () => void;
      }>;
    }>;
    actions: {
      apply: () => void;
      reset: () => void;
      toggleSection: (key: string) => void;
      canApply: boolean;
    };
  }) => React.ReactNode;
}

function normalizeFilterType(type: string): 'multi' | 'single' {
  if (type === 'checkbox-multi' || type === 'checkbox') return 'multi';
  if (type === 'checkbox-single') return 'single';
  return 'multi'; // Default
}

export function FilterPanelHeadless<T extends Record<string, any>>({
  filters,
  config,
  openSections = {},
  onChange,
  onToggleSection,
  onApply,
  onReset,
  hasChanges = false,
  children,
}: FilterPanelHeadlessProps<T>) {
  const filterGroups = config.map((filterConfig) => {
    let currentValue = filters[filterConfig.key];
    const selectionMode = normalizeFilterType(filterConfig.type);

    // Initialize value based on selection mode
    if (selectionMode === 'multi' && !Array.isArray(currentValue)) {
      currentValue = [];
    }

    const isOpen = openSections[filterConfig.key] ?? filterConfig.defaultOpen ?? false;
    const columns = filterConfig.columns ?? 1;

    const options = (filterConfig.options || []).map((option) => {
      const isSelected =
        selectionMode === 'multi'
          ? Array.isArray(currentValue) && currentValue.includes(option.value)
          : currentValue === option.value;

      const toggle = () => {
        if (option.disabled) return;

        if (selectionMode === 'multi') {
          const base = Array.isArray(currentValue) ? currentValue : [];
          const newValue = isSelected
            ? base.filter((v: any) => v !== option.value)
            : [...base, option.value];
          onChange(filterConfig.key as keyof T, newValue);
        } else {
          // Single selection: toggle on/off
          const newValue = isSelected ? undefined : option.value;
          onChange(filterConfig.key as keyof T, newValue);
        }
      };

      return { option, isSelected, toggle };
    });

    return {
      config: filterConfig,
      value: currentValue,
      isOpen,
      columns,
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
          toggleSection: (key: string) => onToggleSection?.(key),
          canApply: hasChanges,
        },
      })}
    </>
  );
}
