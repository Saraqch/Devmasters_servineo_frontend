'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type FilterParamValue = string | string[] | number | boolean | null;

interface Props {
  params: Record<string, FilterParamValue>;
  onClear?: () => void;
  onModify?: () => void;
}

function renderValue(v: FilterParamValue) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

export default function AppliedFilters({ params, onClear, onModify }: Props) {
  const router = useRouter();

  const handleModify = () => {
    if (onModify) return onModify();
    // default behavior: go back to AdvSearch preserving params
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, val]) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach((v) => sp.append(k, String(v)));
      } else {
        sp.set(k, String(val));
      }
    });
    router.push(`/AdvSearch?${sp.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4">
      <div className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">Búsqueda:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(params).map(([k, v]) => {
              const value = renderValue(v as FilterParamValue);
              if (!value) return null;
              return (
                <span
                  key={k}
                  className="inline-block bg-green-50 text-green-800 text-sm px-3 py-1 rounded"
                >
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
