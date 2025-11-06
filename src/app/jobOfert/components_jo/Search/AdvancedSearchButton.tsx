"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AdvancedSearchButtonProps {
  src?: string;
  alt?: string;
}

export function AdvancedSearchButton({ 
  src = '/img/advSearch.jpg', 
  alt = 'Búsqueda avanzada' 
}: AdvancedSearchButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/AdvSearch');
  };

  return (
    <Button
      onClick={handleClick}
      aria-label="Ir a búsqueda avanzada"
      className={`
        bg-[#2B6AE0] 
        text-white
        hover:bg-[#2B6AE0]/90
        active:bg-[#1e4a9f]
        w-auto
        min-w-[2.5rem] sm:min-w-[2.75rem]
        px-2 sm:px-2.5
        h-10 sm:h-11
        text-sm sm:text-base
        font-semibold
        rounded
        shadow-sm
        hover:shadow-md
        transition-all 
        duration-200
        flex 
        items-center 
        justify-center
        shrink-0
      `}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-full" 
      />
    </Button>
  );
}