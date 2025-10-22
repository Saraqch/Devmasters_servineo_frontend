import { Button } from "@/components/ui/button";
import React from "react";

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, ...rest } = props;

  return (
    <Button
      className={`
        bg-[#2B6AE0] text-white
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2B6AE0]/90'}
        w-full sm:w-auto
        px-4 sm:px-6 
        py-2 sm:py-5
        text-sm sm:text-base 
        font-semibold 
        rounded 
        shadow
        transition-all duration-200
      `}
      disabled={disabled}
      {...rest}
    >
      Buscar
    </Button>
  );
}
