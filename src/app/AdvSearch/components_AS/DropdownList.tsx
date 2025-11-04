"use client";

import React, { useState, useEffect } from "react";

interface DropdownListProps {
  onFilterChange?: (filters: { price?: string; tag?: string }) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ onFilterChange }) => {
  const [price, setPrice] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  useEffect(() => {
    onFilterChange?.({ price: price || undefined, tag: tag || undefined });
  }, [price, tag, onFilterChange]);

  const priceOptions = [
    { label: "Todos los precios", value: "" },
    { label: "De 30 a 100 Bs", value: "low" },
    { label: "De 101 a 200 Bs", value: "medium" },
    { label: "De 201 a 300 Bs", value: "high" },
    { label: "De 301 a 400 Bs", value: "very-high" },
  ];

  const tagOptions = [
    { label: "Todas las etiquetas", value: "" },
    { label: "Pintado de exteriores", value: "exterior" },
    { label: "Pintado de interiores", value: "interior" },
    { label: "Pintado de cuadros", value: "cuadro" },
    { label: "Pintado para Fachada de casa", value: "casa" },
    { label: "Pintado en aerosol", value: "aerosol" },
  ];

  return (
    // 🔽 Aquí el cambio clave: se elimina "md:grid-cols-2"
    <div className="grid grid-cols-1 gap-6 w-full">
      {/* Dropdown de Precio */}
      <div className="flex flex-col">
        <label className="text-base font-medium text-gray-700 mb-2">
          Precio:
        </label>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {priceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown de Etiquetas */}
      <div className="flex flex-col">
        <label className="text-base font-medium text-gray-700 mb-2">
          Etiqueta:
        </label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {tagOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownList;
