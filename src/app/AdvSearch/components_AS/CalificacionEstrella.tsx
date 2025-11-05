'use client';
import React, { useState } from 'react';
import { Star } from 'lucide-react';

type Props = {
  value?: number | null;
  onChange?: (val: number | null) => void;
};

const CalificacionEstrella: React.FC<Props> = ({ value = null, onChange }) => {
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const totalStars = 5;

  const handleClick = (star: number) => {
    // toggle: click same star again clears
    const newVal = value === star ? null : star;
    if (onChange) onChange(newVal);
  };

  return (
    <div>
      <h3 className="text-base mb-2">Calificación:</h3>
      <div className="bg-white rounded-lg border border-gray-300 p-4 w-fit">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalStars }, (_, idx) => {
            const starNumber = idx + 1;
            const filled = (hoverStar ?? value ?? 0) >= starNumber;
            return (
              <button
                key={starNumber}
                onClick={() => handleClick(starNumber)}
                onMouseEnter={() => setHoverStar(starNumber)}
                onMouseLeave={() => setHoverStar(null)}
                aria-label={`Seleccionar ${starNumber} estrellas`}
                className="transition-transform hover:scale-110 focus:outline-none"
                type="button"
              >
                <Star
                  size={30}
                  fill={filled ? '#fbbf24' : '#ffffff'}
                  stroke="#000000"
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalificacionEstrella;