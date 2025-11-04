"use client";

import React, { useState, useEffect } from "react";

interface DropdownListProps {
  onFilterChange?: (filters: { price?: string; tag?: string }) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ onFilterChange }) => {
  const [price, setPrice] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ price, tag });
    }
  }, [price, tag]);

  const priceOptions = [
    { label: "Todos los precios", value: "" },
    { label: "De 30 a 100 Bs", value: "low" },
    { label: "De 101 a 200 Bs", value: "medium" },
    { label: "De 201 a 300 Bs", value: "high" },
    { label: "De 301 a 400 Bs", value: "high" },
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
    <div className="flex flex-col space-y-4 w-full sm:w-64">
      {/* Dropdown de Precio */}
      <div className="flex flex-col w-full">
        <label className="text-base mb-2">
          Precio:
        </label>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="sm:w-[700px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {priceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown de Etiquetas */}
      <div className="flex flex-col w-full">
        <label className="text-base mb-2">
          Etiqueta:
        </label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="sm:w-[700px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
