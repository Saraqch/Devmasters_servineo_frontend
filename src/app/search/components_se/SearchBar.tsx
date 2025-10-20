import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from 'lucide-react';
import { X } from 'lucide-react';

// Define las props que recibirá el componente
interface InputDemoProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // <-- agregado
hasError?: boolean; 
}

// Cambia la firma de la función para recibir las props
export function InputDemo({ value = "", onChange, onClear, onKeyDown, hasError = false }: InputDemoProps) {
  const ClearButton = () => (
    <button 
      onClick={onClear}
      type="button"
      style={{
        position: 'absolute',
        right: 8,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
      aria-label="Limpiar búsqueda"
    >
      {/* Icono simple de "X" (SVG) */}
      <X size={16} color="#888" />
    </button>
  );

  const paddingRight = value.length > 0 ? 55 : 35; // 35 (icono) + 20 (botón "X")
        
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: 8, zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <Search size={20} color={hasError ? 'red' : '#888'} />
      </span>
      <Input
        type="text"
        placeholder="¿Qué servicio necesitas?"
        style={{
          paddingLeft: 35,
          paddingRight,
          width: '100%',
          minWidth: 320,
          border: hasError ? '1.5px solid red' : undefined, // <= resaltado rojo
          outline: hasError ? 'none' : undefined,
          boxShadow: hasError ? '0 0 0 1px red' : undefined,
          borderRadius: 4
          // sin maxWidth para permitir que el contenedor controle el tamaño
        }}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} // <-- aquí pasamos el handler
      />
      {value.length > 0 && <ClearButton />}
    </div>
  );
}
