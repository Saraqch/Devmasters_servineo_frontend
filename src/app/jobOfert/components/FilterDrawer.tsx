"use client";

import React, { useState, useEffect } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply?: (offers: any[]) => void;
}

export function FilterDrawer({ isOpen, onClose, onFiltersApply }: FilterDrawerProps) {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    fixer: false,
    ciudad: false,
    trabajo: false
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      applyFilters();
    }
  }, [selectedRanges, selectedCity, selectedJobs]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRangeChange = (range: string) => {
    setSelectedRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(selectedCity === city ? "" : city);
  };

  const handleJobChange = (job: string) => {
    setSelectedJobs(prev => 
      prev.includes(job) 
        ? prev.filter(j => j !== job)
        : [...prev, job]
    );
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    
    if (selectedRanges.length > 0) {
      const ranges = selectedRanges.map(r => r.replace('De (', '').replace(')', ''));
      params.append('range', ranges.join(','));
    }
    
    if (selectedCity) {
      params.append('city', selectedCity);
    }
    
    if (selectedJobs.length > 0) {
      params.append('category', selectedJobs.join(','));
    }

    const url = `http://localhost:3000/api/devmaster/offers/filter?${params.toString()}`;
    console.log('🔍 URL que se está llamando:', url);

    try {
      const response = await fetch(url);
      const result = await response.json();
      
      console.log('✅ Respuesta completa del backend:', result);
      
      const ofertas = result.data || result || [];
      
      console.log('✅ Ofertas extraídas:', ofertas);
      
      if (onFiltersApply) {
        onFiltersApply(ofertas);
      }
    } catch (error) {
      console.error('❌ Error al aplicar filtros:', error);
    }
  };

  const handleReset = () => {
    setSelectedRanges([]);
    setSelectedCity("");
    setSelectedJobs([]);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[75%] sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
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
            <h2 className="text-lg sm:text-xl font-bold">Filtros</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="bg-[#2B6AE0] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#062a7a] transition-colors"
              >
                Resetear
              </button>
              <button
                onClick={onClose}
                className="sm:hidden text-gray-500 hover:text-gray-700 p-2"
                aria-label="Cerrar filtros"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Filtro: Nombre de Fixer */}
            <div className="mb-6">
              <div 
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6] rounded-lg sm:rounded-none"
                onClick={() => toggleSection("fixer")}
              >
                <span className="truncate">Nombre de Fixer</span>
              </div>
              {openSections.fixer && (
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <div className="grid grid-cols-2 gap-2">
                    {["De (A-C)", "De (D-F)", "De (G-I)", "De (J-L)", "De (M-Ñ)", "De (O-Q)", "De (R-T)", "De (U-W)", "De (X-Z)"].map((range) => (
                      <label key={range} className="flex items-center gap-2 text-sm cursor-pointer min-w-0">
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
                </div>
              )}
            </div>

            {/* Filtro: Ciudad */}
            <div className="mb-6">
              <div 
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6] rounded-lg sm:rounded-none"
                onClick={() => toggleSection("ciudad")}
              >
                <span className="truncate">Ciudad</span>
              </div>
              {openSections.ciudad && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"].map((city) => (
                      <label key={city} className="flex items-center gap-2 text-sm cursor-pointer min-w-0">
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
                className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6] rounded-lg sm:rounded-none"
                onClick={() => toggleSection("trabajo")}
              >
                <span className="truncate">Tipo de Trabajo</span>
              </div>
              {openSections.trabajo && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {["Albañil", "Carpintero", "Fontanero", "Electricista", "Pintor", "Soldador", "Jardinero", "Cerrajero", "Mecánico", "Vidriero", "Yesero", "Fumigador", "Limpiador", "Instalador", "Montador", "Decorador", "Pulidor", "Techador"].map((job) => (
                      <label key={job} className="flex items-center gap-2 text-sm cursor-pointer min-w-0">
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