'use client';

import React, { useState } from 'react';
import Header from '@/app/jobOfert/components_jo/Header';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import { InputOnlySearch } from '@/app/jobOfert/components_jo/Search/InputOnlySearch';
import { SearchCheckboxes } from './components_AS/SearchCheckboxes';
import { HelpButton } from './components_AS/HelpButton';
import DropdownList from './components_AS/DropdownList';
import DateFilterSelector from './components_AS/DateFilterSelector';
import CalificacionEstrella from './components_AS/CalificacionEstrella';
import ButtonAplicarBus from './components_AS/ButtonAplicarBus';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
  tags: string[];
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

const parsePriceRange = (priceString: string): { minPrice: number | null, maxPrice: number | null } => {
  switch (priceString) {
      case "low":
          return { minPrice: 30, maxPrice: 100 };
      case "medium":
          return { minPrice: 101, maxPrice: 200 };
      case "high":
          return { minPrice: 201, maxPrice: 400 }; 
      case "":
      default:
          return { minPrice: null, maxPrice: null };
  }
};

const AdvancedSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleOnly, setTitleOnly] = useState(false);
  const [exactWords, setExactWords] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
  });
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [selectedPriceKey, setSelectedPriceKey] = useState<string>('');
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

      if (params.searchText.trim()) urlParams.append('search', params.searchText);
      if (params.titleOnly) urlParams.append('titleOnly', 'true');
      if (params.exactWords) urlParams.append('exactWords', 'true');

      if (params.filters.range && params.filters.range.length > 0)
          params.filters.range.forEach((r) => urlParams.append('range', r));

      if (params.filters.city) urlParams.append('city', params.filters.city);

      if (params.filters.category && params.filters.category.length > 0)
          params.filters.category.forEach((c) => urlParams.append('category', c));

      if (params.filters.tags && params.filters.tags.length > 0)
          urlParams.append('tags', params.filters.tags.join(','));

      if (params.filters.minPrice !== null) urlParams.append('minPrice', `${params.filters.minPrice}`);
      if (params.filters.maxPrice !== null) urlParams.append('maxPrice', `${params.filters.maxPrice}`);

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
    newTags = selectedTags, 
    newPriceKey = selectedPriceKey,
    newSearchQuery = searchQuery,
    newTitleOnly = titleOnly,
    newExactWords = exactWords
  }: { 
    newRanges?: string[], 
    newCity?: string, 
    newJobs?: string[], 
    newTags?: string[], 
    newPriceKey?: string,
    newSearchQuery?: string,
    newTitleOnly?: boolean,
    newExactWords?: boolean
  }) => {
    
    if (!newSearchQuery && newRanges.length === 0 && newCity === '' && 
        newJobs.length === 0 && newTags.length === 0 && newPriceKey === '') {
        console.log('Debe ingresar al menos un parámetro de búsqueda.');
        setResultsCount(0);
        return;
    }
    
    const { minPrice, maxPrice } = parsePriceRange(newPriceKey);

    const currentFilters: FilterState = {
        range: newRanges,
        city: newCity,
        category: newJobs,
        tags: newTags,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        updateSearchOnStateChange({ newSearchQuery: query }); 
    }, 300);
  };
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleDropdownChange = (payload: { tag?: string; price?: string }) => {
    const { tag, price } = payload;
    const newTags = tag && tag !== '' ? [tag] : [];
    setSelectedTags(newTags);
    const newPriceKey = price ?? '';
    setSelectedPriceKey(newPriceKey);
    updateSearchOnStateChange({ newTags, newPriceKey });
  };

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

            {/* Dropdowns de Etiquetas y Precio */}
            <div className="mb-6">
              <DropdownList onFilterChange={handleDropdownChange} />
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

            {/* Botón Aplicar Búsqueda al final izquierdo */}
            <div className="flex justify-start">
              <ButtonAplicarBus 
                onClick={updateSearch} 
                loading={loading} 
              />
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;


