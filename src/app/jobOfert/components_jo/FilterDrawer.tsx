'use client';

import React, { useState, useEffect } from 'react';
import { roboto } from '../../fonts';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply?: (filters: FilterState) => void;
  onReset?: () => void; // Nuevo: callback para resetear a resultados iniciales
}

export function FilterDrawer({ isOpen, onClose, onFiltersApply, onReset }: FilterDrawerProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  useEffect(() => {
  if (isOpen) {
    // En lugar de 'hidden', usa 'scroll' para mantener el espacio de la scrollbar
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

  // Aplicar filtro automáticamente cuando cambia un rango
  const handleRangeChange = (range: string) => {
    const newRanges = selectedRanges.includes(range)
      ? selectedRanges.filter((r) => r !== range)
      : [...selectedRanges, range];
    
    setSelectedRanges(newRanges);
    applyFilters(newRanges, selectedCity, selectedJobs);
  };

  // Aplicar filtro automáticamente cuando cambia la ciudad
  const handleCityChange = (city: string) => {
    const newCity = selectedCity === city ? '' : city;
    setSelectedCity(newCity);
    applyFilters(selectedRanges, newCity, selectedJobs);
  };

  // Aplicar filtro automáticamente cuando cambia el trabajo
  const handleJobChange = (job: string) => {
    const newJobs = selectedJobs.includes(job)
      ? selectedJobs.filter((j) => j !== job)
      : [...selectedJobs, job];
    
    setSelectedJobs(newJobs);
    applyFilters(selectedRanges, selectedCity, newJobs);
  };

  // Función para aplicar filtros
  const applyFilters = (ranges: string[], city: string, jobs: string[]) => {
    if (onFiltersApply) {
      onFiltersApply({
        range: ranges,
        city: city,
        category: jobs,
      });
    }
  };

  // Resetear y aplicar los resultados iniciales
  const handleReset = () => {
    setSelectedRanges([]);
    setSelectedCity('');
    setSelectedJobs([]);
    
    if (onReset) {
      onReset(); // Restaura los resultados iniciales
    } else if (onFiltersApply) {
      onFiltersApply({
        range: [],
        city: '',
        category: [],
      });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`${roboto.variable} font-sans fixed top-0 left-0 h-full w-[75%] sm:w-80 bg-white shadow-xl z-80 transform transition-transform duration-300 ease-in-out overflow-hidden ${
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Filtros</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
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

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Filtro: Nombre de Fixer */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('fixer')}
              >
                <span className="truncate">Nombre de Fixer</span>
              </div>
              {openSections.fixer && (
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <div className="flex gap-8">
                    {[
                      ['De (A-C)', 'De (D-F)', 'De (G-I)', 'De (J-L)', 'De (M-Ñ)'],
                      ['De (O-Q)', 'De (R-T)', 'De (U-W)', 'De (X-Z)'],
                    ].map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-2 flex-1">
                        {column.map((range) => (
                          <label
                            key={range}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 cursor-pointer flex-shrink-0"
                              checked={selectedRanges.includes(range)}
                              onChange={() => handleRangeChange(range)}
                            />
                            <span className="truncate">{range}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Ciudad */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('ciudad')}
              >
                <span className="truncate">Ciudad</span>
              </div>
              {openSections.ciudad && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {[
                      'Beni',
                      'Chuquisaca',
                      'Cochabamba',
                      'La Paz',
                      'Oruro',
                      'Pando',
                      'Potosí',
                      'Santa Cruz',
                      'Tarija',
                    ].map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-2 text-sm cursor-pointer min-w-0 hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                          checked={selectedCity === city}
                          onChange={() => handleCityChange(city)}
                        />
                        <span className="truncate">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Tipo de Trabajo */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('trabajo')}
              >
                <span className="truncate">Tipo de Trabajo</span>
              </div>
              {openSections.trabajo && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {[
                      'Albañil',
                      'Carpintero',
                      'Cerrajero',
                      'Decorador',
                      'Electricista',
                      'Fontanero',
                      'Fumigador',
                      'Instalador',
                      'Jardinero',
                      'Limpiador',
                      'Mecánico',
                      'Montador',
                      'Pintor',
                      'Pulidor',
                      'Soldador',
                      'Techador',
                      'Vidriero',
                      'Yesero',
                    ].map((job) => (
                      <label
                        key={job}
                        className="flex items-center gap-2 text-sm cursor-pointer min-w-0 hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                          checked={selectedJobs.includes(job)}
                          onChange={() => handleJobChange(job)}
                        />
                        <span className="truncate">{job}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}