"use client";

import React from "react";

interface PaginationInfoProps {
  paginaActual: number;
  totalRegistros: number;
  registrosPorPagina: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  paginaActual,
  totalRegistros,
  registrosPorPagina,
}) => {
  const inicioRegistro = (paginaActual - 1) * registrosPorPagina + 1;
  const finRegistro = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-3">
      Mostrando {inicioRegistro} de {finRegistro} de {totalRegistros} resultados
    </div>
  );
};

export default PaginationInfo;
