'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { SortSelectHeadless } from '@/lib/modular/headless';
import { SortSelectProps } from '../SortSelect';
import { registerSortVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SortSelectButtonGroup = React.forwardRef<HTMLDivElement, SortSelectProps>(
  ({ options, value, onChange, label = 'Ordenar por', size = 'md', className }, ref) => {
    const buttonSize = size === 'md' ? 'default' : size; // 'sm' | 'default' | 'lg'

    return (
      <SortSelectHeadless
        value={value || options[0]?.value || ''}
        options={options}
        onChange={onChange}
      >
        {({ options: sortOptions }) => (
          <div ref={ref} className={cn('space-y-2', className)}>
            {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(({ option, isSelected, select }) => (
                <Button
                  key={option.value}
                  onClick={select}
                  variant={isSelected ? 'default' : 'outline'}
                  size={buttonSize as 'default' | 'sm' | 'lg'}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </SortSelectHeadless>
    );
  },
);

SortSelectButtonGroup.displayName = 'SortSelectButtonGroup';

registerSortVariant('button-group', SortSelectButtonGroup);
