import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import React from "react";

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="mt-[-14px] bg-[#f7f7f7] text-white hover:bg-[#ffffff] p-1.5 sm:p-2 rounded-[8px] sm:rounded-[10px] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center font-roboto shadow-lg sm:shadow-xl ring-1 sm:ring-2 cursor-pointer border border-black transition-all"
      {...props}
    >
      <SlidersHorizontal size={20} className="sm:w-6 sm:h-6" color="black" />
    </Button>
  );
}