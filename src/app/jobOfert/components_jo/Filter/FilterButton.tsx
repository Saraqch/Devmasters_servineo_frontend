import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import React from "react";

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="
        bg-[#f7f7f7] 
        text-white 
        hover:bg-[#ffffff] 
        active:bg-[#e8e8e8]
        p-2
        rounded-lg
        w-10 sm:w-11
        h-10 sm:h-11
        flex 
        items-center 
        justify-center 
        font-roboto 
        shadow-sm
        hover:shadow-md
        ring-1
        cursor-pointer 
        border 
        border-black 
        transition-all
        duration-200
        shrink-0
      "
      {...props}
    >
      <SlidersHorizontal size={20} className="sm:w-5 sm:h-5" color="black" />
    </Button>
  );
}