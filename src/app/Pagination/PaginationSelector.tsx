"use client";

import React from "react";

interface PaginationSelectorProps {
  registrosPorPagina: number;
  onChange: (valor: number) => void;
}

const PaginationSelector: React.FC<PaginationSelectorProps> = ({
  registrosPorPagina,
  onChange,
}) => {
  const opciones = [10, 20, 50, 100];

  return (
    <div className="flex items-center gap-2 mt-4">
      <label
        htmlFor="registrosPorPagina"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        Mostrar:
      </label>
      <select
        id="registrosPorPagina"
        value={registrosPorPagina}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm dark:border-gray-600 dark:bg-white/[0.03] dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#465FFF]"
      >
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      resultados
    </div>
  );
};

export default PaginationSelector;
