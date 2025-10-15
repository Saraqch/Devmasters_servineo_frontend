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
import { Roboto } from 'next/font/google';
import Image from 'next/image';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export default function SortCard() {
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
            <Image
              src="/sort.svg"
              alt="Sort icon"
              width={20}
              height={20}
              className="filter invert-0 brightness-0 hue-rotate-[215deg] saturate-[500%]"
            />
            {/* descomentar para ver selected sort en lugar de svg */}
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
              onClick={() => setSelectedSort(option)}
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
