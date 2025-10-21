import { Button } from "@/Components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import React from "react";

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="bg-[#f7f7f7] text-white hover:bg-[#ffffff] p-2 rounded-[10px] w-9 h-9 flex items-center justify-center font-roboto shadow-xl ring-2 cursor-pointer border border-black"
      {...props}
    >
      <SlidersHorizontal size={24} color="black" />
    </Button>
  );
}