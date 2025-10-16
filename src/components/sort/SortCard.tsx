'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface SortCardProps {
  onSelect: (option: string) => void;
}

export default function SortCard({ onSelect }: SortCardProps) {
  const [selectedSort, setSelectedSort] = useState('Los más recientes');

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
          className="flex items-center gap-2 !border-[#286AE0] !text-[#286AE0] hover:!bg-[#1AA7ED] hover:!text-white !transition-colors"
        >
          {/* Ícono de sort inline */}
          <div className="flex items-center justify-center scale-[1.4]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
              className="w-6 h-6"
            >
              <path d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z" />
            </svg>
          </div>
          {/* Para mostrar el texto seleccionado en lugar del ícono */}
          {/* {selectedSort} */}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="!bg-white !border !border-[#759AE0] !shadow-md !rounded-lg z-50"
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => {
              setSelectedSort(option);
              onSelect(option); // Notificar al padre
            }}
            className={`cursor-pointer !px-3 !py-2 !rounded-md !transition-colors ${
              selectedSort === option
                ? '!bg-[#2B6AE0] !text-white'
                : 'hover:!bg-[#2BDDE0] hover:!text-white'
            }`}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
