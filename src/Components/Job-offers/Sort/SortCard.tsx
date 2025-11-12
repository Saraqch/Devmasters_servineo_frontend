'use client';

import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortCardProps {
  value: string; // valor actual seleccionado desde el padre
  onSelect: (option: string) => void; // callback al cambiar
}

export default function SortCard({ value, onSelect }: SortCardProps) {
  const sortOptions = [
    'Destacados',
    'Los más recientes',
    'Los más antiguos',
    'Nombre A-Z',
    'Nombre Z-A',
    'Num de contacto asc',
    'Num de contacto desc',
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex font-bold items-center gap-2 !border-black hover:!bg-[#2B6AE0] hover:!text-white !transition-colors"
        >
          {value}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="!bg-white !border-black !shadow-md !rounded-lg z-70"
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSelect(option)} // Solo notificamos al padre
            className={`cursor-pointer !px-3 !py-2 !rounded-md !transition-colors ${
              value === option
                ? '!bg-[#2B6AE0] !text-white'
                : 'hover:!bg-[#1AA7ED] hover:!text-white'
            }`}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
