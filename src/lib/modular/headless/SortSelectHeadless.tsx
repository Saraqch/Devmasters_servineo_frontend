//src/lib/modular/headless/SortSelectHeadless.tsx
import React from 'react';
import { SortOption } from '../types/base.types';

export interface SortSelectHeadlessProps {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  children: (props: {
    currentOption: SortOption | undefined;
    options: Array<{
      option: SortOption;
      isSelected: boolean;
      select: () => void;
    }>;
  }) => React.ReactNode;
}

export function SortSelectHeadless({
  value,
  options,
  onChange,
  children,
}: SortSelectHeadlessProps) {
  const currentOption = options.find((opt) => opt.value === value);

  const optionsWithHandlers = options.map((option) => ({
    option,
    isSelected: option.value === value,
    select: () => onChange(option.value),
  }));

  return <>{children({ currentOption, options: optionsWithHandlers })}</>;
}
