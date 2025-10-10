import { Input } from "../../../components/ui/input";
import React from "react";

// Define las props que recibirá el componente
interface InputDemoProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Cambia la firma de la función para recibir las props
export function InputDemo({ value, onChange }: InputDemoProps) {
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
        style={{ paddingLeft: 35, width: '100%', minWidth: 300, maxWidth: 1000 }}
        value={value} // Controla el valor
        onChange={onChange} // Llama a la función de cambio
      />
    </div>
  );
}

