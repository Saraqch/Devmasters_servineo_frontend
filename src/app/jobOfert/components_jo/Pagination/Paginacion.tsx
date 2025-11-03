// src/app/jobOfert/components_jo/Pagination/Paginacion.tsx
'use client';
import React from 'react';
import { usePagination } from '@/lib/modular/hooks';
import { PaginationHeadless } from '@/lib/modular/headless';

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
  // ✅ Hook para lógica
  const pagination = usePagination({
    totalItems: totalRegistros,
    initialPage: paginaActual,
    initialPageSize: registrosPorPagina,
  });

  return (
    // ✅ Headless para estructura
    <PaginationHeadless
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPageChange={onChange}
      hasNext={pagination.hasNext}
      hasPrev={pagination.hasPrev}
      maxVisible={5}
    >
      {({ pages, navigation, state }) => (
        // 🎨 Diseño específico de JobOfert
        <div className="flex gap-1 flex-wrap justify-center mt-4">
          {/* Botón Anterior */}
          {state.hasPrev && (
            <button
              onClick={navigation.prevPage}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              Anterior
            </button>
          )}

          {/* Números de página */}
          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => navigation.goToPage(page)}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {page}
              </button>
            ),
          )}

          {/* Botón Siguiente */}
          {state.hasNext && (
            <button
              onClick={navigation.nextPage}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </PaginationHeadless>
  );
};

export default Paginacion;
