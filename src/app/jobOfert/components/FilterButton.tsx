import { Button } from "@/Components/ui/button";
import React from "react";

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="bg-[#f7f7f7] text-white hover:bg-[#ffffff] p-2 rounded-[10px] w-9 h-9 flex items-center justify-center font-roboto shadow-xl ring-2 cursor-pointer border border-black"
      {...props}
    >
      <svg width="40" height="40" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="2" y1="4" x2="13" y2="4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="15" cy="4" r="2" fill="black"/>
        <line x1="17" y1="4" x2="18" y2="4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        
        <line x1="2" y1="10" x2="5" y2="10" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7" cy="10" r="2" fill="black"/>
        <line x1="9" y1="10" x2="18" y2="10" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        
        <line x1="2" y1="16" x2="11" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="13" cy="16" r="2" fill="black"/>
        <line x1="15" y1="16" x2="18" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </Button>
  );
}