'use client';

import React, { useState, useRef } from 'react';
import Header from '@/app/jobOfert/components_jo/Header';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import { InputOnlySearch } from '@/app/jobOfert/components_jo/Search/InputOnlySearch';
import { SearchCheckboxes } from './components_AS/SearchCheckboxes';
import { HelpButton } from './components_AS/HelpButton';
import DropdownList from './components_AS/DropdownList'; // <-- Nuevo componente
import useSyncUrlParamsAdv from './hooks/useSyncUrlParams'; // ajustar ruta si hace falta
import { useRouter } from 'next/navigation';
import PriceRangeList from './components_AS/PriceRangeList';
import DateFilterSelector from './components_AS/DateFilterSelector';
import CalificacionEstrella from './components_AS/CalificacionEstrella';
import ButtonAplicarBus from './components_AS/ButtonAplicarBus';
import ClearButton from './components_AS/ClearButton';
import Footer from './components_AS/Footer';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
  tags: string[];
  priceRanges: string[];
  minPrice: number | null;
  maxPrice: number | null;
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



// Small helper to parse a price-range key into numeric min/max values.
// Accepts strings like "$100 - $200", "100-200", "100" and returns {minPrice, maxPrice}.
function parsePriceRange(key: string): { minPrice: number | null; maxPrice: number | null } {
  if (!key) return { minPrice: null, maxPrice: null };
  // Normalize: remove currency symbols and replace commas with nothing
  const normalized = key.replace(/[$€£,]/g, '');
  // Find numbers (integers or decimals)
  const matches = normalized.match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return { minPrice: null, maxPrice: null };
  if (matches.length === 1) return { minPrice: Number(matches[0]), maxPrice: null };
  return { minPrice: Number(matches[0]), maxPrice: Number(matches[1]) };
}

function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleOnly, setTitleOnly] = useState(false);
  const [exactWords, setExactWords] = useState(false);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
    categorias: false,
    precio: false,
  });
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Estados para dropdowns (controlados por DropdownList)
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [selectedPriceKey, _setSelectedPriceKey] = useState<string>(''); // Usaremos 'Key' para el valor del dropdown

  // Estado para resultados (permitiendo la mutabilidad)
  const [resultsCount, setResultsCount] = useState<number | null>(null); // Permitir null para estado inicial/carga
  const [loading, setLoading] = useState(false); // Permitir cambiar el estado de carga
  const router = useRouter();
  const skipSyncRef = useRef<boolean | null>(null);
  
  // signal to force child components to clear their internal selection
  const [clearSignal, setClearSignal] = useState<number>(0);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchOffers = async (params: { 
      searchText: string; 
      filters: FilterState;
      titleOnly: boolean; 
      exactWords: boolean; 
  }) => {
      setLoading(true);
      const urlParams = new URLSearchParams();

      if (params.searchText.trim()) {
        urlParams.append('search', params.searchText);
      }
      if (params.titleOnly) {
        urlParams.append('titleOnly', 'true');
      }
      if (params.exactWords) {
        urlParams.append('exactWords', 'true');
      }

      if (params.filters.range && params.filters.range.length > 0) {
          params.filters.range.forEach((r) => {
              urlParams.append('range', r);
          });
      }
      if (params.filters.city) {
          urlParams.append('city', params.filters.city);
      }
      if (params.filters.category && params.filters.category.length > 0) {
          params.filters.category.forEach((c) => {
              urlParams.append('category', c);
          });
      }

      if (params.filters.tags && params.filters.tags.length > 0) {
      urlParams.append('tags', params.filters.tags.join(','));
      }

      if (params.filters.priceRanges && params.filters.priceRanges.length > 0) {
          params.filters.priceRanges.forEach((r) => {
              urlParams.append('priceRange', r);
          });
      }
      // ⚠️ NOTA IMPORTANTE: Los rangos (ej. "$100 - $200") deben ser parseados en el Backend.
      // Aquí solo enviamos el string del rango como filtro.
      urlParams.append('page', '1');
      urlParams.append('limit', '10'); 

      const url = `/api/devmaster/offers?${urlParams.toString()}`;
      console.log('API URL generada:', url);
      
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setResultsCount(101);
      setLoading(false);
  };

  const updateSearchOnStateChange = ({ 
    newRanges = selectedRanges, 
    newCity = selectedCity, 
    newJobs = selectedJobs, 
    newCategories = selectedCategories,
    newPriceRanges = selectedPriceRanges,
    newSearchQuery = searchQuery,
    newTitleOnly = titleOnly,
    newExactWords = exactWords,
    newPriceKey = selectedPriceKey,
  }: { 
    newRanges?: string[], 
    newCity?: string, 
    newJobs?: string[], 
    newCategories?: string[],
    newPriceRanges?: string[],
    newSearchQuery?: string,
    newTitleOnly?: boolean,
    newExactWords?: boolean,
    newPriceKey?: string,
  }) => {
    
   if (!newSearchQuery && newRanges.length === 0 && newCity === '' && 
        newJobs.length === 0 && newCategories.length === 0 && newPriceRanges.length === 0) { //  Condición actualizada
        console.log('Debe ingresar al menos un parámetro de búsqueda.');
        setResultsCount(0);
        return;
    }

  const { minPrice, maxPrice } = parsePriceRange(newPriceKey ?? '');

  const currentFilters: FilterState = {
    range: newRanges,
    city: newCity,
    category: newJobs,
    tags: newCategories,
    priceRanges: newPriceRanges,
    minPrice,
    maxPrice,
  };

    fetchOffers({
        searchText: newSearchQuery,
        filters: currentFilters,
        titleOnly: newTitleOnly,
        exactWords: newExactWords,
    });
  };

  const updateSearch = () => updateSearchOnStateChange({});

  const handleRangeChange = (range: string) => {
    setSelectedRanges(prevRanges => {
      const newRanges = prevRanges.includes(range)
        ? prevRanges.filter((r) => r !== range)
        : [...prevRanges, range];
      updateSearchOnStateChange({ newRanges });
      return newRanges;
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(prevCity => {
      const newCity = prevCity === city ? '' : city;
      updateSearchOnStateChange({ newCity });
      return newCity;
    });
  };

  const handleJobChange = (job: string) => {
    setSelectedJobs(prevJobs => {
      const newJobs = prevJobs.includes(job)
        ? prevJobs.filter((j) => j !== job)
        : [...prevJobs, job];
      updateSearchOnStateChange({ newJobs });
      return newJobs;
    });
  };
// Reemplaza handleSearch y handleDropdownChange:

  // Handler para el Input de Búsqueda (con debounce)
  const handleSearch = (query: string) => {
  setSearchQuery(query);
  // Prevent the AdvSearch URL-sync hook from overriding the navigation
  skipSyncRef.current = true;
  // Navigate to jobOfert with current filters + this query
  const params = new URLSearchParams();
  if (query.trim()) params.set('search', query.trim());
  if (titleOnly) params.set('titleOnly', 'true');
  if (exactWords) params.set('exact', 'true');
  selectedRanges.forEach(r => params.append('range', r));
  if (selectedCity) params.set('city', selectedCity);
  if (selectedJobs.length) params.set('category', selectedJobs.join(','));
  if (selectedTags.length) params.set('tags', selectedTags.join(','));
  const { minPrice, maxPrice } = parsePriceRange(selectedPriceKey);
  if (minPrice != null) params.set('minPrice', String(minPrice));
  if (maxPrice != null) params.set('maxPrice', String(maxPrice));
  params.set('page', '1');
  params.set('limit', '10');
  // Force a full navigation to /jobOfert to ensure the page component mounts and shows results.
  // Using window.location avoids client-side URL-replace races with the local sync hook.
  if (typeof window !== 'undefined') {
    window.location.href = `/jobOfert?${params.toString()}`;
  } else {
    router.push(`/jobOfert?${params.toString()}`);
  }
  };
 
  // Handler que recibe cambios desde DropdownList (etiquetas)
  // DropdownList calls onFilterChange({ categories: string[] })
  const handleDropdownChange = (filters: { categories: string[] }) => {
    const newTags = Array.isArray(filters.categories) ? filters.categories : [];
    setSelectedTags(newTags);
    // DropdownList doesn't provide price; keep existing price key unchanged
    updateSearchOnStateChange({ newCategories: newTags });
  };

  // Handler para rangos de precio (PriceRangeList)
  // PriceRangeList calls onFilterChange({ priceRanges: string[] })
  const handlePriceRangeChange = (filters: { priceRanges: string[] }) => {
    const newPriceRanges = Array.isArray(filters.priceRanges) ? filters.priceRanges : [];
    setSelectedPriceRanges(newPriceRanges);
    updateSearchOnStateChange({ newPriceRanges });
  };

  useSyncUrlParamsAdv({
    search: searchQuery,
    filters: {
      range: selectedRanges,
      city: selectedCity,
      category: selectedJobs,
      tags: selectedTags,
      minPrice: parsePriceRange(selectedPriceKey).minPrice,
      maxPrice: parsePriceRange(selectedPriceKey).maxPrice,
    },
    titleOnly,
    exact: exactWords,
    skipSyncRef,
  });

  return (
    <>
      <Header />
      <HelpButton />

      <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Búsqueda Avanzada
        </h1>

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-0">
            <div className="w-full sm:w-80">
              <ResultsCounter total={resultsCount ?? 0} loading={loading} />
            </div>
          </div>

          <div className="w-full sm:w-[700px] mx-auto -mt-60">
            <div className="mb-4">
              <InputOnlySearch onSearch={handleSearch} />
            </div>

            <div className="mb-6">
              <SearchCheckboxes
                titleOnly={titleOnly}
                setTitleOnly={(val) => { setTitleOnly(val); setTimeout(() => updateSearchOnStateChange({ newTitleOnly: val }), 0); }}
                exactWords={exactWords}
                setExactWords={(val) => { setExactWords(val); setTimeout(() => updateSearchOnStateChange({ newExactWords: val }), 0); }}
              />
            </div>

            <div className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-bold mb-6 rounded-lg text-left">
              Parámetros Seleccionables:
            </div>

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

            <div className="mb-6">
              <h3 className="text-base mb-2">Etiquetas :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${openSections.categorias
                    ? 'rounded-t-lg border border-b-0 border-gray-300'
                    : 'rounded-lg border border-gray-300'
                  }`}
                onClick={() => toggleSection('categorias')}
              >
                <span className="truncate">Seleccionar etiquetas</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-200 ${openSections.categorias ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {openSections.categorias && (
                <div className="bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-sm">
                  <DropdownList onFilterChange={handleDropdownChange} clearSignal={clearSignal} />
                </div>
              )}
            </div>
<div className="mb-6">
              <h3 className="text-base mb-2">Precio :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${openSections.precio
                    ? 'rounded-t-lg border border-b-0 border-gray-300'
                    : 'rounded-lg border border-gray-300'
                  }`}
                onClick={() => toggleSection('precio')}
              >
                <span className="truncate">Seleccionar Rangos de Precio</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-200 ${openSections.precio ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {openSections.precio && (
                <div className="bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-sm">
                  <PriceRangeList onFilterChange={handlePriceRangeChange} clearSignal={clearSignal} /> 
                </div>
              )}
            </div>
            {/* NUEVO: Filtro de Fecha y Calificación */}
            <div className="mb-6 flex gap-6 items-start">
              <div className="flex-shrink-0">
                <DateFilterSelector />
              </div>
              <div className="flex-shrink-0">
                <CalificacionEstrella />
              </div>
            </div>

            {/* Botones: Aplicar Búsqueda y Limpiar Datos (misma altura y alineación) */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <ButtonAplicarBus onClick={updateSearch} loading={loading} />
              <ClearButton onClick={() => {
                // Limpia todos los filtros y la búsqueda a nivel de página
                setSearchQuery('');
                setSelectedRanges([]);
                setSelectedCity('');
                setSelectedJobs([]);
                setSelectedCategories([]);
                setSelectedPriceRanges([]);
                setTitleOnly(false);
                setExactWords(false);
                setResultsCount(null);
                // notify children (DropdownList, PriceRangeList) to clear
                setClearSignal((s) => s + 1);
              }} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdvancedSearchPage;

