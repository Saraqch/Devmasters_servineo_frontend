// src/app/jobOfert/components_jo/Filter/FilterDrawer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { roboto } from '../../../fonts';
import { useFilter } from '@/lib/modular/hooks';
import { FilterPanelHeadless } from '@/lib/modular/headless';
import { FilterConfig } from '@/lib/modular/types/base.types';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply?: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

// Configuración de filtros
const FILTER_CONFIG: FilterConfig[] = [
  {
    key: 'range',
    label: 'Nombre de Fixer',
    type: 'checkbox',
    multiple: true,
    options: [
      { value: 'De (A-C)', label: 'De (A-C)' },
      { value: 'De (D-F)', label: 'De (D-F)' },
      { value: 'De (G-I)', label: 'De (G-I)' },
      { value: 'De (J-L)', label: 'De (J-L)' },
      { value: 'De (M-Ñ)', label: 'De (M-Ñ)' },
      { value: 'De (O-Q)', label: 'De (O-Q)' },
      { value: 'De (R-T)', label: 'De (R-T)' },
      { value: 'De (U-W)', label: 'De (U-W)' },
      { value: 'De (X-Z)', label: 'De (X-Z)' },
    ],
  },
  {
    key: 'city',
    label: 'Ciudad',
    type: 'radio',
    options: [
      { value: 'Beni', label: 'Beni' },
      { value: 'Chuquisaca', label: 'Chuquisaca' },
      { value: 'Cochabamba', label: 'Cochabamba' },
      { value: 'La Paz', label: 'La Paz' },
      { value: 'Oruro', label: 'Oruro' },
      { value: 'Pando', label: 'Pando' },
      { value: 'Potosí', label: 'Potosí' },
      { value: 'Santa Cruz', label: 'Santa Cruz' },
      { value: 'Tarija', label: 'Tarija' },
    ],
  },
  {
    key: 'category',
    label: 'Tipo de Trabajo',
    type: 'checkbox',
    multiple: true,
    options: [
      { value: 'Albañil', label: 'Albañil' },
      { value: 'Carpintero', label: 'Carpintero' },
      { value: 'Cerrajero', label: 'Cerrajero' },
      { value: 'Decorador', label: 'Decorador' },
      { value: 'Electricista', label: 'Electricista' },
      { value: 'Fontanero', label: 'Fontanero' },
      { value: 'Fumigador', label: 'Fumigador' },
      { value: 'Instalador', label: 'Instalador' },
      { value: 'Jardinero', label: 'Jardinero' },
      { value: 'Limpiador', label: 'Limpiador' },
      { value: 'Mecánico', label: 'Mecánico' },
      { value: 'Montador', label: 'Montador' },
      { value: 'Pintor', label: 'Pintor' },
      { value: 'Pulidor', label: 'Pulidor' },
      { value: 'Soldador', label: 'Soldador' },
      { value: 'Techador', label: 'Techador' },
      { value: 'Vidriero', label: 'Vidriero' },
      { value: 'Yesero', label: 'Yesero' },
    ],
  },
];

export function FilterDrawer({
  isOpen,
  onClose,
  onFiltersApply,
  initialFilters = { range: [], city: '', category: [] },
}: FilterDrawerProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    range: false,
    city: false,
    category: false,
  });

  // ✅ Hook para lógica
  const filter = useFilter<FilterState>({
    initialFilters,
    onChange: (filters) => {
      // Aplicar automáticamente cuando cambian
      setTimeout(() => {
        filter.applyFilters();
      }, 0);
    },
    onApply: onFiltersApply,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'scroll';
    } else {
      document.body.style.overflowY = 'unset';
    }
    return () => {
      document.body.style.overflowY = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 duration-300 z-40 bg-black ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`${roboto.variable} font-sans fixed top-0 left-0 h-full w-[75%] sm:w-63 bg-white shadow-xl z-80 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>

        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base sm:text-lg font-bold">Filtros</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => filter.reset({ range: [], city: '', category: [] })}
                className="bg-[#2B6AE0] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2B31E0] transition-colors"
              >
                Resetear
              </button>
              <button
                onClick={onClose}
                className="sm:hidden text-gray-500 hover:text-gray-700 p-2"
                aria-label="Cerrar filtros"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ✅ Headless para estructura */}
          <FilterPanelHeadless
            filters={filter.filters}
            config={FILTER_CONFIG}
            onChange={filter.updateFilter}
            onApply={filter.applyFilters}
            onReset={filter.reset}
            hasChanges={filter.hasChanges}
          >
            {({ filterGroups }) => (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* 🎨 Diseño específico de JobOfert */}
                {filterGroups.map((group) => (
                  <div key={group.config.key} className="mb-6">
                    {/* Header del grupo */}
                    <div
                      className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                      onClick={() => toggleSection(group.config.key)}
                    >
                      <span className="truncate">{group.config.label}</span>
                    </div>

                    {/* Opciones del grupo */}
                    {openSections[group.config.key] && (
                      <div
                        className={`bg-white border border-gray-200 p-4 rounded ${
                          group.config.key !== 'range'
                            ? 'max-h-[130px] overflow-y-auto custom-scrollbar'
                            : ''
                        }`}
                      >
                        {/* Layout especial para range (2 columnas) */}
                        {group.config.key === 'range' ? (
                          <div className="flex gap-2">
                            {[group.options.slice(0, 5), group.options.slice(5)].map(
                              (column, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-2 flex-1">
                                  {column.map(({ option, isSelected, toggle }) => (
                                    <label
                                      key={option.value}
                                      className="flex items-center gap-2 text-xs cursor-pointer hover:text-[#2B31E0] transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer flex-shrink-0"
                                        checked={isSelected}
                                        onChange={toggle}
                                      />
                                      <span className="truncate">{option.label}</span>
                                    </label>
                                  ))}
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          // Layout normal (1 columna)
                          <div className="flex flex-col gap-2">
                            {group.options.map(({ option, isSelected, toggle }) => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 text-xs cursor-pointer min-w-0 hover:text-[#2B31E0] transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 cursor-pointer flex-shrink-0"
                                  checked={isSelected}
                                  onChange={toggle}
                                />
                                <span className="truncate">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </FilterPanelHeadless>
        </div>
      </div>
    </>
  );
}
