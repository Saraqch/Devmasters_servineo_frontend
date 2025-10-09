import { Button } from "@/components/ui/button";
import React from "react";

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="bg-[#001f3f] text-white hover:bg-[#003366] px-6 py-2 text-base font-semibold rounded shadow"
      {...props}
    >
      Buscar
    </Button>
  );
}