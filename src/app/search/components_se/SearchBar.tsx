import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from 'lucide-react';
import { X } from 'lucide-react';

// Define las props que recibirá el componente
interface InputDemoProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasError?: boolean; 
}

// Cambia la firma de la función para recibir las props
export function InputDemo({ value = "", onChange, onClear, onKeyDown, hasError = false }: InputDemoProps) {
  const ClearButton = () => (
    <button 
      onClick={onClear}
      type="button"
      className="absolute right-2 z-[2] flex items-center justify-center w-5 h-5 bg-transparent border-none cursor-pointer p-0"
      aria-label="Limpiar búsqueda"
    >
      <X size={16} color="#888" />
    </button>
  );
        
  return (
    <div className="relative flex items-center w-full">
      <span className="absolute left-2 z-[2] flex items-center">
        <Search size={20} color={hasError ? 'red' : '#888'} />
      </span>
      <Input
        type="text"
        placeholder="¿Qué servicio necesitas?"
        className={`pl-9 ${value.length > 0 ? 'pr-14' : 'pr-9'} w-full sm:min-w-80 rounded ${
          hasError 
            ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' 
            : ''
        }`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {value.length > 0 && <ClearButton />}
    </div>
  );
}