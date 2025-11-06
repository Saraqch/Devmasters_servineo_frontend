'use client';

import React, { useState, useEffect } from 'react';

interface DropdownListProps {
  onFilterChange?: (filters: { categories: string[] }) => void;
  // A numeric signal that when changed forces the component to clear its selection.
  clearSignal?: number;
}

const DropdownList: React.FC<DropdownListProps> = ({ onFilterChange, clearSignal }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Quick mock mode for development: generate suggestions locally so you don't need backend now.
        const isDevelopment = process.env.NODE_ENV === 'development';

        const MOCK_TAGS = [
          'madera',
          'herramientas',
          'instalación',
          'reparación',
          'montaje',
          'acabados',
          'medición',
          'transporte',
          'electricidad',
          'soldadura',
          'pintura',
          'barniz',
          'vigas',
          'puertas',
          'ventanas',
          'cerrajería',
          'fontanería',
          'limpieza',
          'jardinería',
          'aislamiento',
          'cerramiento',
        ];

        // helper: try to read current search input value (InputOnlySearch) from the DOM as a fast fallback
        const getInputSearchValue = (): string => {
          try {
            if (typeof window === 'undefined') return '';
            // try query param first
            const sp = new URLSearchParams(window.location.search);
            const s = sp.get('search');
            if (s) return String(s).trim();
            // fallback: find input by placeholder (falls back if user typed but didn't apply)
            const el = document.querySelector(
              'input[placeholder="¿Qué servicio necesitas?"]',
            ) as HTMLInputElement | null;
            if (el && el.value) return el.value.trim();
          } catch {
            // ignore
          }
          return '';
        };

        // simple synonym map for a couple of likely searches
        const SYNONYMS: Record<string, string[]> = {
          carpintero: ['madera', 'vigas', 'puertas'],
          pintor: ['pintura', 'barniz', 'acabados'],
          electricista: ['electricidad', 'instalación', 'reparación'],
        };

        if (isDevelopment) {
          const currentSearch = getInputSearchValue().toLowerCase();
          let suggestions: string[] = [];

          if (currentSearch) {
            // pick synonyms if available
            const tokens = currentSearch
              .split(/\s+/)
              .map((t) => t.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/g, ''));
            for (const t of tokens) {
              if (SYNONYMS[t]) {
                suggestions = suggestions.concat(SYNONYMS[t]);
              }
            }

            // also include mock tags that contain the token
            suggestions = suggestions.concat(
              MOCK_TAGS.filter((tag) => tokens.some((tok) => tag.includes(tok))),
            );
          }

          // If no search-based suggestions, show most common mock tags
          if (suggestions.length === 0) suggestions = MOCK_TAGS.slice(0, 6);

          // dedupe and limit to 6 (UI can display more), but user wanted up to 3 in real suggest flow
          const deduped = Array.from(new Set(suggestions)).slice(0, 6);
          setCategories(deduped);
          setError(null);
          return;
        }

        // Production: fallback to original network request
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || 'https://devmastersservineobackend-ashy.vercel.app';
        const endpoint = `${API_URL}/api/devmaster/tags`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        if (Array.isArray(data)) setCategories(data);
        else if (data.tags && Array.isArray(data.tags)) setCategories(data.tags);
        else throw new Error('Formato de respuesta inesperado');
        setError(null);
      } catch (err) {
        let errorMessage = 'Error desconocido';
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          errorMessage =
            'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error('❌ Error completo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // When parent requests a clear (clearSignal changes), reset internal selection
  useEffect(() => {
    if (typeof clearSignal === 'undefined') return;
    // Parent changed clearSignal: reset selection
    setSelectedCategories([]);
    onFilterChange?.({ categories: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  const handleCheckboxChange = (categoryValue: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((cat) => cat !== categoryValue)
      : [...selectedCategories, categoryValue];

    setSelectedCategories(newSelectedCategories);
    onFilterChange?.({ categories: newSelectedCategories });
  };

  if (loading) {
    return (
      <div className="w-full border border-gray-300 rounded-lg p-8 text-center">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
        <p className="text-gray-500 text-xs mt-2">Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border border-red-300 rounded-lg p-4 bg-red-50">
        <div className="text-center">
          <p className="text-red-600 text-sm font-semibold mb-2">⚠️ Error al cargar categorías</p>
          <p className="text-red-500 text-xs mb-3">{error}</p>
          <div className="bg-white border border-red-200 rounded p-3 text-left">
            <p className="text-gray-700 text-xs font-semibold mb-1">Verifica:</p>
            <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
              <li>
                Backend en desarrollo:{' '}
                <code className="bg-gray-100 px-1 rounded">http://localhost:8000</code>
              </li>
              <li>
                Backend en producción:{' '}
                <code className="bg-gray-100 px-1 rounded text-[10px]">
                  https://devmastersservineobackend-ashy.vercel.app
                </code>
              </li>
              <li>
                Endpoint: <code className="bg-gray-100 px-1 rounded">/api/devmaster/tags</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full border border-gray-300 rounded-lg p-4">
        <p className="text-gray-500 text-sm text-center">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="max-h-64 overflow-y-auto">
        {categories.map((category, index) => (
          <label
            key={`${category}-${index}`}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== categories.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700 capitalize">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DropdownList;
