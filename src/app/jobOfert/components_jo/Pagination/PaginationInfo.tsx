// src/app/jobOfert/components_jo/Pagination/PaginationInfo.tsx
'use client';
import React from 'react';
import { usePagination } from '@/lib/modular/hooks';

interface PaginationInfoProps {
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  paginaActual,
  registrosPorPagina,
  totalRegistros,
}) => {
  // ✅ Hook para lógica
  const pagination = usePagination({
    totalItems: totalRegistros,
    initialPage: paginaActual,
    initialPageSize: registrosPorPagina,
  });

  if (totalRegistros === 0) {
    return <div className="text-sm text-gray-600 mt-3">Mostrando 0 de 0 resultados</div>;
  }

  return (
    <div className="text-sm text-gray-600 mt-3">
      Mostrando {pagination.startIndex} - {pagination.endIndex} de {totalRegistros} resultados
    </div>
  );
};

export default PaginationInfo;
