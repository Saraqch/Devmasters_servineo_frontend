'use client';
import React from 'react';

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
  if (totalRegistros === 0) {
    return <div className="text-sm text-gray-600 mt-3">Mostrando 0 de 0 resultados</div>;
  }

  const inicioRegistro = (paginaActual - 1) * registrosPorPagina + 1;
  const finRegistro = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  return (
    <div className="text-sm text-gray-600 mt-3">
      Mostrando {inicioRegistro} - {finRegistro} de {totalRegistros} resultados
    </div>
  );
};

export default PaginationInfo;
