// Paginacion.tsx
'use client';
import React from 'react';

interface PaginacionProps {
  paginaActual: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onChange: (numero: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  totalRegistros,
  registrosPorPagina,
  onChange,
}) => {
  // Calcular total de páginas mínimo 1
  const totalPaginas = Math.max(Math.ceil(totalRegistros / registrosPorPagina), 1);

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="flex gap-1 flex-wrap justify-center mt-4">
      <button
        onClick={() => onChange(Math.max(paginaActual - 1, 1))}
        disabled={paginaActual === 1}
        className={`px-3 py-1 rounded ${
          paginaActual === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
        }`}
      >
        Anterior
      </button>

      {paginas.map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`px-3 py-1 rounded transition-colors duration-200 ${
            num === paginaActual
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(paginaActual + 1, totalPaginas))}
        disabled={paginaActual === totalPaginas}
        className={`px-3 py-1 rounded ${
          paginaActual === totalPaginas
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
        }`}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paginacion;


