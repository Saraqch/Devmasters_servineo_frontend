'use client';
import React from 'react';

interface ResultsCounterProps {
  total: number;
  loading?: boolean;
}

export function ResultsCounter({ total, loading = false }: ResultsCounterProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Título FUERA de la forma - letra más grande */}
      <p className="text-sm font-bold text-gray-900 mb-4 text-center leading-tight">
        CANTIDAD
        <br />
        DE RESULTADOS
      </p>
      
      {/* Contenedor con forma de escudo - más ancho */}
      <div className="relative w-36 h-36">
        {/* Forma de escudo SVG */}
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Escudo con esquinas redondeadas arriba y punta abajo */}
          <path 
            d="M 15 20 Q 15 10 25 10 L 95 10 Q 105 10 105 20 L 105 100 L 60 140 L 15 100 Z" 
            fill="#E8F4FD" 
            stroke="none"
          />
        </svg>
        
        {/* Contenido sobre el escudo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          {/* Ícono de documento */}
          <div className="flex justify-center mb-3">
            <svg 
              className="w-10 h-10 text-blue-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {/* Ícono de documento con líneas horizontales */}
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Solo el número - sin "Empleos" */}
          <p className="text-3xl font-bold text-blue-600">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              total
            )}
          </p>
        </div>
      </div>
    </div>
  );
}