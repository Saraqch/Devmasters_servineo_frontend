import { Button } from "@/components/ui/button";
import React from "react";

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, ...rest } = props;
     return (
    <Button
      // Usa una clase condicional para el estilo del botón deshabilitado
      className={`
        bg-[#001f3f] text-white
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#003366]'}
        px-6 py-2 text-base font-semibold rounded shadow
      `}
      disabled={disabled} // Aplica la propiedad disabled
      {...rest}
    >
      Buscar
    </Button>
  );
}