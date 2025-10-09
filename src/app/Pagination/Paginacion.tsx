
import React from 'react';

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onPaginaChange: (pagina: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  totalPaginas,
  totalRegistros,
  registrosPorPagina,
  onPaginaChange
}) => {
  // Calcular el rango de registros mostrados
  const inicioRegistro = (paginaActual - 1) * registrosPorPagina + 1;
  const finRegistro = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  // Generar números de página a mostrar
  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxBotones = 5;
    
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);
    
    // Ajustar si estamos cerca del final
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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-1 p-4 border border-gray-200 rounded-lg bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Fecha actual a la izquierda */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {inicioRegistro} de {finRegistro} de {totalRegistros}
        </div>
      </div>

      {/* Contador de registros y controles de paginación */}
      <div className="flex items-center gap-6">

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          {/* Botón página anterior */}
          <button
            onClick={() => onPaginaChange(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`p-2 rounded border transition-colors ${
              paginaActual === 1
                ? 'border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:text-gray-500'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Números de página */}
          <div className="flex gap-1">
            {numerosPagina.map((numero) => (
              <button
                key={numero}
                onClick={() => onPaginaChange(numero)}
                className={`min-w-8 h-8 px-2 rounded border text-sm font-medium transition-colors ${
                  numero === paginaActual
                    ? 'border-[#465FFF] bg-[#465FFF] text-white'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]'
                }`}
              >
                {numero}
              </button>
            ))}
          </div>

          {/* Botón página siguiente */}
          <button
            onClick={() => onPaginaChange(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`p-2 rounded border transition-colors ${
              paginaActual === totalPaginas
                ? 'border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:text-gray-500'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/[0.02]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paginacion;