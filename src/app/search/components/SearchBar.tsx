// src/app/search/SearchBar.tsx
import { Input } from "../../../Components/ui/input";
import React from "react";

// Define las props que recibirá el componente
interface InputDemoProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // <-- agregado
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // <-- agregado
}

// Cambia la firma de la función para recibir las props
export function InputDemo({ value = "", onChange, onClear, onKeyDown, onBlur }: InputDemoProps) {
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );

  const paddingRight = value.length > 0 ? 55 : 35; // 35 (icono) + 20 (botón "X")
        
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: 8, zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <svg id="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="#888" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="2" fill="none" />
          <line x1="15" y1="15" x2="19" y2="19" stroke="#888" strokeWidth="2" />
        </svg>
      </span>
      <Input
        type="text"
        placeholder="¿Qué servicio necesitas?"
        style={{ paddingLeft: 35, paddingRight, width: '100%', minWidth: 300, maxWidth: 1000 }}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} // <-- aquí pasamos el handler
        onBlur={onBlur} // <-- aquí se pasa
      />
      {value.length > 0 && <ClearButton />}
    </div>
  );
}
