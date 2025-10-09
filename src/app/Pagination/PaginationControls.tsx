"use client";

import React from "react";

interface PaginationControlsProps {
  paginaActual: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  paginaActual,
  totalPaginas,
  onPaginaChange,
}) => {
  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxBotones = 5;

    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio + 1 < maxBotones) {
      inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }

    return numeros;
  };

  const numerosPagina = obtenerNumerosPagina();

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Botón anterior */}
      <button
        onClick={() => onPaginaChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={`p-2 rounded border transition-colors ${
          paginaActual === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:text-gray-500"
            : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Números */}
      {numerosPagina.map((numero) => (
        <button
          key={numero}
          onClick={() => onPaginaChange(numero)}
          className={`min-w-8 h-8 px-2 rounded border text-sm font-medium transition-colors ${
            numero === paginaActual
              ? "border-[#465FFF] bg-[#465FFF] text-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]"
          }`}
        >
          {numero}
        </button>
      ))}

      {/* Botón siguiente */}
      <button
        onClick={() => onPaginaChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={`p-2 rounded border transition-colors ${
          paginaActual === totalPaginas
            ? "border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:text-gray-500"
            : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default PaginationControls;
