'use client';

import React, { useState } from 'react';
import Header from '@/app/jobOfert/components_jo/Header';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import { InputOnlySearch } from '@/app/jobOfert/components_jo/Search/InputOnlySearch';
import { SearchCheckboxes } from './components_AS/SearchCheckboxes';
import { HelpButton } from './components_AS/HelpButton';
import DropdownList from './components_AS/DropdownList'; // <-- Nuevo componente

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

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

const AdvancedSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleOnly, setTitleOnly] = useState(false);
  const [exactWords, setExactWords] = useState(false);

  // Estados para la Búsqueda Avanzada
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Estados para dropdowns (ahora controlados desde page.tsx pero actualizados por DropdownList)
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 0 o 1 elemento
  const [selectedPrice, setSelectedPrice] = useState<string>('');

  // Estado para resultados (manteniendo lo original)
  const [resultsCount] = useState(0);
  const [loading] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Esta función es un placeholder. En una app real, enviaría los filtros al backend.
  const executeSearchWithFilters = (ranges: string[], city: string, jobs: string[]) => {
    const filters: FilterState = { range: ranges, city: city, category: jobs };
    console.log('Filtros Aplicados (server payload):', filters);
    // Aquí iría la llamada a la API o la lógica de filtrado...
  };

  // updateSearch ahora puede recibir tags y price opcionales.
  const updateSearch = (tags?: string[], price?: string) => {
    // Ejecutar búsqueda principal con rangos/ciudad/trabajo
    executeSearchWithFilters(selectedRanges, selectedCity, selectedJobs);

    // Log o envío de etiquetas/precio. Si quieres integrarlo en la misma petición,
    // modifica executeSearchWithFilters para aceptar estos parámetros.
    console.log('Etiquetas (local):', tags ?? selectedTags);
    console.log('Precio (local):', price ?? selectedPrice);
  };

  const handleRangeChange = (range: string) => {
    const newRanges = selectedRanges.includes(range)
      ? selectedRanges.filter((r) => r !== range)
      : [...selectedRanges, range];

    setSelectedRanges(newRanges);
    updateSearch();
  };

  const handleCityChange = (city: string) => {
    const newCity = selectedCity === city ? '' : city;
    setSelectedCity(newCity);
    updateSearch();
  };

  const handleJobChange = (job: string) => {
    const newJobs = selectedJobs.includes(job)
      ? selectedJobs.filter((j) => j !== job)
      : [...selectedJobs, job];

    setSelectedJobs(newJobs);
    updateSearch();
  };

  // Handler para el Input de Búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Buscar desde AdvancedSearch:', query);
    // Si prefieres ejecutar la búsqueda al tipear, llama a updateSearch() aquí
  };

  // --- Handler que recibe cambios desde DropdownList ---
  const handleDropdownChange = (payload: { tag?: string; price?: string }) => {
    const { tag, price } = payload;

    // tag es string o undefined. Guardamos como array 0 o 1.
    const newTags = tag && tag !== '' ? [tag] : [];
    setSelectedTags(newTags);

    const newPrice = price ?? '';
    setSelectedPrice(newPrice);

    // Llamar a updateSearch con los valores actualizados
    updateSearch(newTags, newPrice);
  };

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

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-0">
            <div className="w-full sm:w-80">
              <ResultsCounter total={resultsCount} loading={loading} />
            </div>
          </div>

          <div className="w-full sm:w-[700px] mx-auto -mt-60">
            <div className="mb-4">
              <InputOnlySearch onSearch={handleSearch} />
            </div>

            <div className="mb-6">
              <SearchCheckboxes
                titleOnly={titleOnly}
                setTitleOnly={setTitleOnly}
                exactWords={exactWords}
                setExactWords={setExactWords}
              />
            </div>

            <div className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-bold mb-6 rounded-lg text-left">
              Parámetros Seleccionables:
            </div>

            {/* Fixer filter */}
            <div className="mb-6">
              <h3 className="text-base mb-2">Nombre del fixer :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${openSections.fixer
                    ? 'rounded-t-lg border border-b-0 border-gray-300'
                    : 'rounded-lg border border-gray-300'
                  }`}
                onClick={() => toggleSection('fixer')}
              >
                <span className="truncate">Seleccionar Rangos de Nombre</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-200 ${openSections.fixer ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {openSections.fixer && (
                <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg shadow-sm">
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

            {/* Ciudad filter */}
            <div className="mb-6">
              <h3 className="text-base mb-2">Ciudad :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${openSections.ciudad
                    ? 'rounded-t-lg border border-b-0 border-gray-300'
                    : 'rounded-lg border border-gray-300'
                  }`}
                onClick={() => toggleSection('ciudad')}
              >
                <span className="truncate">Seleccionar Ciudad</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-200 ${openSections.ciudad ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {openSections.ciudad && (
                <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg shadow-sm max-h-[200px] overflow-y-auto">
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

            {/* Trabajo filter */}
            <div className="mb-6">
              <h3 className="text-base mb-2">Tipo de Trabajo :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${openSections.trabajo
                    ? 'rounded-t-lg border border-b-0 border-gray-300'
                    : 'rounded-lg border border-gray-300'
                  }`}
                onClick={() => toggleSection('trabajo')}
              >
                <span className="truncate">Seleccionar Tipo de Trabajo</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-200 ${openSections.trabajo ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {openSections.trabajo && (
                <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg shadow-sm max-h-[200px] overflow-y-auto">
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

            {/* Aquí se invoca el nuevo componente DropdownList (Etiquetas y Precio) */}
            <div className="mb-6">
              <DropdownList onFilterChange={handleDropdownChange} />
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;

