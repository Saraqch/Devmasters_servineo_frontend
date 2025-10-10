"use client";
import React, { useState } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6">
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

        {/* Filtro: Nombre de Fixer */}
        <div className="mb-6">
          <div 
            className="bg-[#2B6AE0] text-white px-4 py-2 font-semibold mb-3 cursor-pointer hover:bg-[#1e5bc6]"
            onClick={() => toggleSection("fixer")}
          >
            Nombre de Fixer
          </div>
          {openSection === "fixer" && (
            <div className="bg-white border border-gray-200 p-4 rounded">
              <div className="grid grid-cols-2 gap-2">
                {["De (A-C)", "De (D-F)", "De (G-I)", "De (J-L)", "De (M-Ñ)", "De (O-Q)", "De (R-T)", "De (U-W)", "De (X-Z)"].map((range) => (
                  <label key={range} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
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
          {openSection === "ciudad" && (
            <div className="bg-white border border-gray-200 p-4 rounded max-h-60 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"].map((city) => (
                  <label key={city} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
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
          {openSection === "trabajo" && (
            <div className="bg-white border border-gray-200 p-4 rounded max-h-60 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {["Albañil", "Carpintero", "Fontanero", "Electricista", "Pintor", "Soldador", "Jardinero", "Cerrajero", "Mecánico", "Vidriero", "Yesero", "Fumigador", "Limpiador", "Instalador", "Montador", "Decorador", "Pulidor", "Techador"].map((job) => (
                  <label key={job} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{job}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}