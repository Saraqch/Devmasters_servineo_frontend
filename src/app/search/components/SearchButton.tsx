// src/app/search/components/SearchButton.tsx
'use client';
import React from "react";
import { Button } from "@/components/ui/button";

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, children, className = "", ...rest } = props;

  return (
    <Button
      disabled={disabled}
      {...rest}
      className={`
        bg-[#2B6AE0] text-white 
        px-6 py-2 text-base font-semibold rounded shadow 
        font-['Roboto',sans-serif]
        transition-all duration-200
        cursor-pointer
        ${disabled ? "cursor-not-allowed !bg-[#2B6AE0] !text-white !opacity-100" : "hover:bg-[#2B6AE0]/90"}
        ${className}
      `}
    >
      {children ?? "Buscar"}
    </Button>
  );
}
