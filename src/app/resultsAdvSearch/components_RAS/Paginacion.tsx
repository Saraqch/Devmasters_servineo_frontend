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
  // Calcular total de páginas
  const totalPaginas = Math.max(Math.ceil(totalRegistros / registrosPorPagina), 1);
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  // Calcular si ya se alcanzó el último registro
  const registrosMostrados = paginaActual * registrosPorPagina;
  const yaLlegoAlFinal = registrosMostrados >= totalRegistros;

  return (
    <div className="flex gap-1 flex-wrap justify-center mt-4">
      {/* Botón Anterior (solo se muestra si no estamos en la primera página) */}
      {paginaActual > 1 && (
        <button
          onClick={() => onChange(paginaActual - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-500 hover:text-white"
        >
          Anterior
        </button>
      )}

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

      {!yaLlegoAlFinal && (
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
      )}
    </div>
  );
};

export default Paginacion;
