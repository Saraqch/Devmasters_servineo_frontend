//SearchButton
import { Button } from "@/components/ui/button";
import React from "react";

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, ...rest } = props;

  return (
    <Button
      className={`
        bg-[#2B6AE0] 
        text-white
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2B6AE0]/90 active:bg-[#1e4a9f]'}
        w-auto
        min-w-[4.5rem] sm:min-w-[5rem]
        px-3 sm:px-6 
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
      disabled={disabled}
      {...rest}
    >
      Buscar
    </Button>
  );
}