'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type FilterParamValue = string | string[] | number | boolean | null;

            {/* Render combined price tag if minPrice/maxPrice present */}
            {(() => {
              const min = params['minPrice'] as number | null | undefined;
              const max = params['maxPrice'] as number | null | undefined;
              if (min != null || max != null) {
                let label = '';
                if (min != null && max != null) label = `Precio: ${min}bs - ${max}bs`;
                else if (min != null) label = `Precio: desde ${min}bs`;
                else label = `Precio: hasta ${max}bs`;
                return (
                  <>
                    <span key="price-range" className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                      {label}
                    </span>
                    {Object.entries(params)
                      .filter(([k]) => k !== 'minPrice' && k !== 'maxPrice')
                      .map(([k, v]) => {
                        if (k === 'titleOnly' && v === true) {
                          return (
                            <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                              Buscar solo en el título de la Oferta de Trabajo
                            </span>
                          );
                        }

                        if (k === 'exact' && v === true) {
                          return (
                            <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                              Palabras Exactas
                            </span>
                          );
                        }

                        const value = renderValue(v as FilterParamValue);
                        if (!value) return null;
                        return (
                          <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                            {value}
                          </span>
                        );
                      })}
                  </>
                );
              }

              return Object.entries(params).map(([k, v]) => {
  params: Record<string, FilterParamValue>;
                if (k === 'titleOnly' && v === true) {
                  return (
                    <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                      Buscar solo en el título de la Oferta de Trabajo
                    </span>
                  );
                }

                if (k === 'exact' && v === true) {
                  return (
                    <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                      Palabras Exactas
                    </span>
                  );
                }

                const value = renderValue(v as FilterParamValue);
                if (!value) return null;
                return (
                  <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                    {value}
                  </span>
                );
              });
            })()}
      }
    });
    router.push(`/AdvSearch?${sp.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4">
      <div className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between font-['Roboto'] text-sm">
        <div>
          <p className="text-sm font-semibold text-gray-700">Búsqueda:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(params).map(([k, v]) => {
              // Special labels for boolean flags
              if (k === 'titleOnly' && v === true) {
                return (
                  <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                    Buscar solo en el título de la Oferta de Trabajo
                  </span>
                );
              }

              if (k === 'exact' && v === true) {
                return (
                  <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                    Palabras Exactas
                  </span>
                );
              }

              const value = renderValue(v as FilterParamValue);
              if (!value) return null;
              return (
                <span key={k} className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded">
                  {value}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm px-3 py-1 bg-white border rounded text-blue-600 hover:bg-blue-50"
            onClick={handleModify}
          >
            Modificar
          </button>
          <button
            type="button"
            className="text-sm px-3 py-1 bg-white border rounded text-red-600 hover:bg-red-50"
            onClick={() => onClear && onClear()}
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
