"use client";

import React, { useState } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    fixer: false,
    ciudad: false,
    trabajo: false
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

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

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Estilos personalizados para scrollbar */}
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

      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filtros</h2>
          <button
            onClick={onClose}
            className="bg-[#2B6AE0] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#062a7a]"
          >
            Resetear
          </button>
        </div>

        {/* Contenedor con scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Filtro: Nombre de Fixer */}
          <div className="mb-6">
            <div 
              className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6]"
              onClick={() => toggleSection("fixer")}
            >
              Nombre de Fixer
            </div>
            {openSections.fixer && (
              <div className="bg-white border border-gray-200 p-4 rounded">
                <div className="grid grid-cols-2 gap-2">
                  {["De (A-C)", "De (D-F)", "De (G-I)", "De (J-L)", "De (M-Ñ)", "De (O-Q)", "De (R-T)", "De (U-W)", "De (X-Z)"].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        checked={selectedRanges.includes(range)} 
                        onChange={() => handleRangeChange(range)}
                      />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtro: Ciudad */}
          <div className="mb-6">
            <div 
              className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6]"
              onClick={() => toggleSection("ciudad")}
            >
              Ciudad
            </div>
            {openSections.ciudad && (
              <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"].map((city) => (
                    <label key={city} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        checked={selectedCity === city} 
                        onChange={() => handleCityChange(city)}
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtro: Tipo de Trabajo */}
          <div className="mb-6">
            <div 
              className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6]"
              onClick={() => toggleSection("trabajo")}
            >
              Tipo de Trabajo
            </div>
            {openSections.trabajo && (
              <div className="bg-white border border-gray-200 p-4 rounded max-h-[160px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {["Albañil", "Carpintero", "Fontanero", "Electricista", "Pintor", "Soldador", "Jardinero", "Cerrajero", "Mecánico", "Vidriero", "Yesero", "Fumigador", "Limpiador", "Instalador", "Montador", "Decorador", "Pulidor", "Techador"].map((job) => (
                    <label key={job} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        checked={selectedJobs.includes(job)} 
                        onChange={() => handleJobChange(job)}
                      />
                      <span>{job}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}