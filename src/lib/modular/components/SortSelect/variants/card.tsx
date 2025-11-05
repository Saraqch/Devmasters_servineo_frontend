'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { SortSelectHeadless } from '@/lib/modular/headless';
import { SortSelectProps } from '../SortSelect';
import { registerSortVariant } from '../registry';
import { cn } from '@/lib/utils';

export const SortSelectCard = React.forwardRef<HTMLDivElement, SortSelectProps>(
  ({ options, value, onChange, label = 'Ordenar por', size = 'md', className }, ref) => {
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
          <div ref={ref} className={cn('flex flex-col gap-2', className)}>
            {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex font-bold items-center gap-2 !border-black hover:!bg-[#2B6AE0] hover:!text-white !transition-colors',
                    currentSize,
                  )}
                >
                  {currentOption?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="!bg-white !border-black !shadow-md !rounded-lg z-70"
              >
                {sortOptions.map(({ option, isSelected, select }) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={select}
                    className={cn(
                      `cursor-pointer !px-3 !py-2 !rounded-md !transition-colors`,
                      isSelected
                        ? '!bg-[#2B6AE0] !text-white'
                        : 'hover:!bg-[#1AA7ED] hover:!text-white',
                    )}
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

SortSelectCard.displayName = 'SortSelectCard';

registerSortVariant('card', SortSelectCard);
