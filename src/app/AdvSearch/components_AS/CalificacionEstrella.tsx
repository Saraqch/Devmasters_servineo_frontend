'use client';
import React, { useState } from 'react';
import { Star, RotateCcw } from 'lucide-react';

const CalificacionEstrella = () => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [finalRating, setFinalRating] = useState<number | null>(null);
  const [hoverStar, setHoverStar] = useState<number | null>(null);

  const totalStars = 5;

  const handleStarClick = (starNumber: number) => {
    setSelectedStar(starNumber);
    setFinalRating(null);
  };

  const handleDecimalSelect = (decimal: number) => {
    setFinalRating(decimal);
  };

  const handleReset = () => {
    setSelectedStar(null);
    setFinalRating(null);
    setHoverStar(null);
  };

  const renderStars = (rating: number | null) => {
    return Array.from({ length: totalStars }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = rating !== null && starNumber <= Math.floor(rating);
      const displayRating = hoverStar !== null ? hoverStar : rating;
      const isHovered = displayRating !== null && starNumber <= Math.floor(displayRating);

      return (
        <button
          key={starNumber}
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => setHoverStar(starNumber)}
          onMouseLeave={() => setHoverStar(null)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={48}
            fill={isHovered ? "#fbbf24" : (isFilled ? "#fbbf24" : "#ffffff")}
            stroke="#000000"
            strokeWidth={2}
          />
        </button>
      );
    });
  };

  const renderDecimalOptions = () => {
    if (selectedStar === null) return null;

    const options = [];
    for (let i = 0; i <= 9; i++) {
      const decimalValue = selectedStar + (i / 10);
      options.push(
        <button
          key={i}
          onClick={() => handleDecimalSelect(decimalValue)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors rounded-lg w-full"
        >
          <Star size={24} fill="#fbbf24" stroke="#f59e0b" strokeWidth={2} />
          <span className="text-xl font-semibold text-gray-700">
            {decimalValue.toFixed(1)}
          </span>
        </button>
      );
    }

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-sm font-bold text-gray-800">
            Selecciona calificación
          </h3>
          <button
            onClick={() => setSelectedStar(null)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium ml-4"
          >
            Cancelar
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
          {options}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Calificación:</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center gap-2">
          {renderStars(finalRating)}
        </div>

        {finalRating !== null && (
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <RotateCcw size={20} />
              <span className="font-medium">Restablecer</span>
            </button>
          </div>
        )}

        {/* Decimal Options */}
        {renderDecimalOptions()}
      </div>
    </div>
  );
};

export default CalificacionEstrella;