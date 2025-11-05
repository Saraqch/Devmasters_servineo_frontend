'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown } from 'lucide-react';
import { SortSelectHeadless } from '@/lib/modular/headless';
import { SortSelectProps } from '../SortSelect';
import { registerSortVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SortSelectDropdown = React.forwardRef<HTMLDivElement, SortSelectProps>(
  (
    { options, value, onChange, label = 'Ordenar por', size = 'md', showIcon = true, className },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    };
    const currentSize = sizeClasses[size];

    return (
      <SortSelectHeadless
        value={value || options[0]?.value || ''}
        options={options}
        onChange={onChange}
      >
        {({ currentOption, options: sortOptions }) => (
          <div ref={ref} className={cn('flex items-center gap-2', className)}>
            {label && <span className="text-sm text-muted-foreground">{label}:</span>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn('gap-2', currentSize)}>
                  {showIcon && <ArrowUpDown size={16} />}
                  <span>{currentOption?.label || 'Seleccionar'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map(({ option, isSelected, select }) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={select}
                    className={cn('cursor-pointer', isSelected && 'bg-accent font-semibold')}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SortSelectHeadless>
    );
  },
);

SortSelectDropdown.displayName = 'SortSelectDropdown';

registerSortVariant('dropdown', SortSelectDropdown);
