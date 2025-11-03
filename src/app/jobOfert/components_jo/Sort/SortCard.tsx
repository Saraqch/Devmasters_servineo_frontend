// src/app/jobOfert/components_jo/Sort/SortCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useSort } from '@/lib/modular/hooks';
import { SortSelectHeadless } from '@/lib/modular/headless';
import { SortOption } from '@/lib/modular/types/base.types';

interface SortCardProps {
  options: SortOption[];
  initialSort?: string;
  onSelect: (option: string) => void;
}

export default function SortCard({ options, initialSort, onSelect }: SortCardProps) {
  // ✅ Hook para lógica
  const sort = useSort({
    initialSort: initialSort || options[0]?.value || '',
    options,
    onChange: onSelect,
  });

  return (
    // ✅ Headless para estructura
    <SortSelectHeadless value={sort.value} options={sort.options} onChange={sort.setValue}>
      {({ currentOption, options: sortOptions }) => (
        // 🎨 Diseño específico de JobOfert
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex font-bold items-center gap-2 !border-black hover:!bg-[#2B6AE0] hover:!text-white !transition-colors"
            >
              {currentOption?.label || 'Ordenar'}
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
                className={`cursor-pointer !px-3 !py-2 !rounded-md !transition-colors ${
                  isSelected ? '!bg-[#2B6AE0] !text-white' : 'hover:!bg-[#1AA7ED] hover:!text-white'
                }`}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </SortSelectHeadless>
  );
}
