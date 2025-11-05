'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortSelectProps } from '../SortSelect';
import { registerSortVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SortSelectSelect = React.forwardRef<HTMLDivElement, SortSelectProps>(
  ({ options, value, onChange, label = 'Ordenar por', size = 'md', className }, ref) => {
    const sizeClasses = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    };
    const currentSize = sizeClasses[size];

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        {label && <span className="text-sm text-muted-foreground">{label}:</span>}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={cn('w-[200px]', currentSize)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

SortSelectSelect.displayName = 'SortSelectSelect';

registerSortVariant('select', SortSelectSelect);
