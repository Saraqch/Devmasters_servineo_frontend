'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/jobOfert/components_jo/Header';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import { InputOnlySearch } from '@/app/jobOfert/components_jo/Search/InputOnlySearch';
import { SearchCheckboxes } from './components_AS/SearchCheckboxes';
import { HelpButton } from './components_AS/HelpButton';

// Nota: Asumiendo que validateFilters es accesible o su lógica se manejará aquí.
// Por simplicidad, la función validateFilters se asume que existe en la aplicación.

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

// Datos estáticos para los filtros (tomados de FilterDrawer)
const FIXER_RANGES = [
  ['De (A-C)', 'De (D-F)', 'De (G-I)', 'De (J-L)', 'De (M-Ñ)'],
  ['De (O-Q)', 'De (R-T)', 'De (U-W)', 'De (X-Z)'],
];

const CITIES = [
  'Beni', 'Chuquisaca', 'Cochabamba', 'La Paz', 'Oruro', 
  'Pando', 'Potosí', 'Santa Cruz', 'Tarija',
];

const JOBS = [
  'Albañil', 'Carpintero', 'Cerrajero', 'Decorador', 'Electricista', 
  'Fontanero', 'Fumigador', 'Instalador', 'Jardinero', 'Limpiador', 
  'Mecánico', 'Montador', 'Pintor', 'Pulidor', 'Soldador', 
  'Techador', 'Vidriero', 'Yesero',
];

const AdvancedSearchPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [titleOnly, setTitleOnly] = React.useState(false);
  const [exactWords, setExactWords] = React.useState(false);
  
  // Estados para la Búsqueda Avanzada
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  
  // Estado para resultados (manteniendo lo original)
  const [resultsCount] = React.useState(0);
  const [loading] = React.useState(false);


  // --- Lógica de Filtros (Adaptada de FilterDrawer) ---

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Esta función es un placeholder. En una aplicación real, enviaría los filtros
  // al backend o a otra función que ejecute la búsqueda.
  const executeSearchWithFilters = (ranges: string[], city: string, jobs: string[]) => {
    const filters: FilterState = { range: ranges, city: city, category: jobs };
    // Aquí iría la llamada a la API o la lógica de filtrado...
    console.log('Filtros Aplicados:', filters);
    // Nota: Por ahora, el resultsCount se mantiene en 0, no hay lógica de búsqueda real aquí.
  };

  const handleRangeChange = (range: string) => {
    const newRanges = selectedRanges.includes(range)
      ? selectedRanges.filter((r) => r !== range)
      : [...selectedRanges, range];
    
    setSelectedRanges(newRanges);
    executeSearchWithFilters(newRanges, selectedCity, selectedJobs);
  };

  const handleCityChange = (city: string) => {
    // Implementa la lógica de selección única para la ciudad
    const newCity = selectedCity === city ? '' : city;
    setSelectedCity(newCity);
    executeSearchWithFilters(selectedRanges, newCity, selectedJobs);
  };

  const handleJobChange = (job: string) => {
    const newJobs = selectedJobs.includes(job)
      ? selectedJobs.filter((j) => j !== job)
      : [...selectedJobs, job];
    
    setSelectedJobs(newJobs);
    executeSearchWithFilters(selectedRanges, selectedCity, newJobs);
  };
  
  // Handler para el Input de Búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Buscar desde AdvancedSearch:', query);
    // Aquí se ejecutaría executeSearchWithFilters con la nueva query
  };

  // --- Renderizado ---

  const FilterSectionButton = ({ sectionKey, title }: { sectionKey: string, title: string }) => (
    <div
      className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-lg transition-colors flex justify-between items-center"
      onClick={() => toggleSection(sectionKey)}
    >
      <span className="truncate">{title}</span>
      {/* Icono de flecha para indicar expansión */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 transform transition-transform duration-200 ${openSections[sectionKey] ? 'rotate-180' : 'rotate-0'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <>
      <Header />
      
      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* Main con padding-top para compensar el header fixed */}
      <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Búsqueda Avanzada
        </h1>
        
        {/* Contenedor principal para definir el ancho máximo */}
        <div className="max-w-7xl mx-auto">
          
          {/* Fila 1: Contador de Resultados (Pushed a la Derecha) */}
          <div className="flex justify-end mb-0">
            <div className="w-full sm:w-80"> 
              <ResultsCounter total={resultsCount} loading={loading} />
            </div>
          </div>

          {/* Fila 2: Barra de Búsqueda y Checkboxes (Centrados y del Mismo Tamaño) */}
          {/* El bloque principal de búsqueda y filtros */}
          <div className="w-full sm:w-[700px] mx-auto -mt-60"> 
            
            {/* Barra de Búsqueda */}
            <div className="mb-4">
              <InputOnlySearch onSearch={handleSearch} />
            </div>
            
            {/* Checkboxes de Título/Palabras Exactas */}
            <div className="mb-6">
              <SearchCheckboxes
                titleOnly={titleOnly}
                setTitleOnly={setTitleOnly}
                exactWords={exactWords}
                setExactWords={setExactWords}
              />
            </div>

            {/* Separador de Parámetros Seleccionables, replicando el estilo de la imagen */}
            <div className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-bold mb-6 rounded-lg text-left">
              Parámetros Seleccionables:
            </div>

            {/* --- Filtro: Nombre de Fixer --- */}
            <div className="mb-6">
              <FilterSectionButton sectionKey="fixer" title="Nombre del fixer :" />
              {openSections.fixer && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {FIXER_RANGES.flat().map((range) => (
                      <label
                        key={range}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0 text-[#2B6AE0] rounded border-gray-300 focus:ring-[#2B6AE0]"
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

            {/* --- Filtro: Ciudad --- */}
            <div className="mb-6">
              <FilterSectionButton sectionKey="ciudad" title="Ciudad :" />
              {openSections.ciudad && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm max-h-[200px] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {CITIES.map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0 text-[#2B6AE0] rounded border-gray-300 focus:ring-[#2B6AE0]"
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

            {/* --- Filtro: Tipo de Trabajo --- */}
            <div className="mb-6">
              <FilterSectionButton sectionKey="trabajo" title="Tipo de Trabajo :" />
              {openSections.trabajo && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm max-h-[200px] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {JOBS.map((job) => (
                      <label
                        key={job}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0 text-[#2B6AE0] rounded border-gray-300 focus:ring-[#2B6AE0]"
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
      </main>
    </>
  );
};

export default AdvancedSearchPage;
