'use client';

import React, { useState } from 'react';

// Genera rangos de 100 en 100 hasta un máximo.
const generatePriceRanges = (max: number = 1000) => {
  const ranges: string[] = [];
  for (let start = 0; start < max; start += 100) {
    const end = start + 100;
    ranges.push(`$${start} - $${end}`);
  }
  ranges.push(`Más de $${max}`); // Opcional: un rango superior
  return ranges;
};

const PRICE_RANGES = generatePriceRanges(500); // Rango de ejemplo: $0 a $500+

interface PriceRangeListProps {
  onFilterChange?: (filters: { priceRanges: string[] }) => void;
}

const PriceRangeList: React.FC<PriceRangeListProps> = ({ onFilterChange }) => {
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  // No necesitamos loading/error ya que los rangos son estáticos

  const handleCheckboxChange = (rangeValue: string) => {
    const newSelectedRanges = selectedRanges.includes(rangeValue)
      ? selectedRanges.filter((range) => range !== rangeValue)
      : [...selectedRanges, rangeValue];

    setSelectedRanges(newSelectedRanges);
    // Notifica al componente padre
    onFilterChange?.({ priceRanges: newSelectedRanges });
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="max-h-64 overflow-y-auto">
        {PRICE_RANGES.map((range, index) => (
          <label
            key={`${range}-${index}`}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== PRICE_RANGES.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedRanges.includes(range)}
              onChange={() => handleCheckboxChange(range)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700 capitalize">{range}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeList;