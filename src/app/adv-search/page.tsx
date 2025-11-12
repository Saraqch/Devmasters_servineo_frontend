'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/Components/Job-offers/Header';
import { ResultsCounter } from '@/Components/Adv-search/ResultsCounter';
import { InputOnlySearch } from '@/Components/Job-offers/Search/InputOnlySearch';
import { SearchCheckboxes } from '@/Components/Adv-search/SearchCheckboxes';
import { HelpButton } from '@/Components/Adv-search/HelpButton';
import DropdownList from '@/Components/Adv-search/DropdownList'; // <-- Nuevo componente
import useSyncUrlParamsAdv from './hooks/useSyncUrlParams'; // ajustar ruta si hace falta
// removed unused useRouter
import useAdvSearchLogic from './hooks/useAdvSearchLogic';
import PriceRangeList from '@/Components/Adv-search/PriceRangeList';
import DateFilterSelector from '@/Components/Adv-search/DateFilterSelector';
import CalificacionEstrella from '@/Components/Adv-search/CalificacionEstrella';
import ButtonAplicarBus from '@/Components/Adv-search/ButtonAplicarBus';
import ClearButton from '@/Components/Adv-search/ClearButton';
import Footer from '@/Components/Adv-search/Footer';

const FIXER_RANGES = [
  ['De (A-C)', 'De (D-F)', 'De (G-I)', 'De (J-L)', 'De (M-Ñ)'],
  ['De (O-Q)', 'De (R-T)', 'De (U-W)', 'De (X-Z)'],
];

const CITIES = [
  'Beni',
  'Chuquisaca',
  'Cochabamba',
  'La Paz',
  'Oruro',
  'Pando',
  'Potosí',
  'Santa Cruz',
  'Tarija',
];

const JOBS = [
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
];

// removed unused FilterState and parsePriceRange to eliminate lint warnings

function AdvancedSearchPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    // state
    searchQuery,
    titleOnly,
    exactWords,
    openSections,
    selectedRanges,
    selectedCity,
    selectedJobs,
    selectedTags,
    selectedPriceKey,
    loading,
    totalRegistros,
    storeLoading,
    clearSignal,
    skipSyncRef,
    // handlers
    setSearchQuery,
    setTitleOnly,
    setExactWords,
    toggleSection,
    handleRangeChange,
    handleCityChange,
    handleJobChange,
    handleDropdownChange,
    handlePriceRangeChange,
    handleSearch,
    setClearSignal,
    updateSearchOnStateChange,
    setSelectedRanges,
    setSelectedCity,
    setSelectedJobs,
    setSelectedCategories,
    setSelectedPriceRanges,
    setResultsCount,
    // date filter state from hook
    selectedDateFilter,
    setSelectedDateFilter,
    selectedSpecificDate,
    setSelectedSpecificDate,
    // rating
    selectedRating,
    setSelectedRating,
    fetchGlobalTotal,
  } = useAdvSearchLogic();

  const router = useRouter();

  // Close advanced search and go back to job-offer when user presses Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/job-offer');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router]);

  // compute min/max from selectedPriceKey (kept local for URL sync)
  const _priceNormalized = (selectedPriceKey || '').replace(/[$€£,]/g, '');
  const _priceMatches = _priceNormalized.match(/-?\d+(?:\.\d+)?/g) || [];
  const _minPrice = _priceMatches[0] ? Number(_priceMatches[0]) : null;
  const _maxPrice = _priceMatches[1] ? Number(_priceMatches[1]) : null;

  // include date and sort selection so the URL keeps the date param set by the selector
  let advDate: string | null = null;
  if (selectedDateFilter === 'specific' && selectedSpecificDate) {
    const y = selectedSpecificDate.getFullYear();
    const m = String(selectedSpecificDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedSpecificDate.getDate()).padStart(2, '0');
    advDate = `${y}-${m}-${d}`;
  }
  const advSort =
    selectedDateFilter === 'recent' ? 'recent' : selectedDateFilter === 'oldest' ? 'oldest' : null;

  useSyncUrlParamsAdv({
    search: searchQuery,
    filters: {
      range: selectedRanges,
      city: selectedCity,
      category: selectedJobs,
      tags: selectedTags,
      minPrice: _minPrice,
      maxPrice: _maxPrice,
    },
    date: advDate,
    rating: selectedRating,
    sortBy: advSort,
    titleOnly,
    exact: exactWords,
    skipSyncRef,
  });

  return (
    <>
      <Header />
      <HelpButton />

      <main
        className={`pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 transition-all duration-300 ${isCalendarOpen ? 'pb-96' : 'pb-12'}`}
      >
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Búsqueda Avanzada
        </h1>

        <div className="max-w-7xl mx-auto">
          <div className="w-full sm:w-[700px] mx-auto">
            <div className="mb-3">
              <ResultsCounter total={totalRegistros ?? 0} loading={storeLoading ?? loading} />
            </div>

            <div className="mb-4">
              <InputOnlySearch onSearch={handleSearch} onValueChange={(v) => setSearchQuery(v)} />
            </div>

            <div className="mb-6">
              <SearchCheckboxes
                titleOnly={titleOnly}
                setTitleOnly={(val) => {
                  setTitleOnly(val);
                  setTimeout(() => updateSearchOnStateChange({ newTitleOnly: val }), 0);
                }}
                exactWords={exactWords}
                setExactWords={(val) => {
                  setExactWords(val);
                  setTimeout(() => updateSearchOnStateChange({ newExactWords: val }), 0);
                }}
              />
            </div>

            <div className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-bold mb-6 rounded-lg text-left">
              Parámetros Seleccionables:
            </div>

            <div className="mb-6">
              <h3 className="text-base mb-2">Nombre del fixer :</h3>
              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${
                    openSections.fixer
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
                  ${
                    openSections.ciudad
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
                  ${
                    openSections.trabajo
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
                  ${
                    openSections.categorias
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
                  <DropdownList
                    onFilterChange={handleDropdownChange}
                    clearSignal={clearSignal}
                    searchQuery={searchQuery}
                    categoryFilters={selectedJobs}
                  />
                </div>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-base mb-2">Precio :</h3>

              <div
                className={`bg-gray-100 text-gray-500 px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center 
                  ${
                    openSections.precio
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
                  <PriceRangeList
                    onFilterChange={handlePriceRangeChange}
                    clearSignal={clearSignal}
                  />
                </div>
              )}
            </div>
            {/* NUEVO: Filtro de Fecha y Calificación */}
            {/* Responsive: en móvil mostrar Calificación encima de Fecha; en md+ mantener fila */}
            <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 order-2 md:order-1 w-full md:w-auto">
                <DateFilterSelector
                  selectedFilter={selectedDateFilter}
                  selectedDate={selectedSpecificDate}
                  onChange={(f, d) => {
                    setSelectedDateFilter(f);
                    setSelectedSpecificDate(d ?? null);
                  }}
                  onCalendarToggle={setIsCalendarOpen}
                />
              </div>
              <div className="flex-shrink-0 order-1 md:order-2 w-full md:w-auto">
                <CalificacionEstrella value={selectedRating} onChange={setSelectedRating} />
              </div>
            </div>

            {/* Botones: Aplicar Búsqueda y Limpiar Datos (misma altura y alineación) */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <ButtonAplicarBus
                onClick={() => handleSearch(searchQuery)}
                loading={storeLoading ?? loading}
              />
              <ClearButton
                onClick={() => {
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
                  // reset date filter
                  setSelectedDateFilter('specific');
                  setSelectedSpecificDate(null);
                  // reset rating
                  setSelectedRating(null);
                  // notify children (DropdownList, PriceRangeList) to clear
                  setClearSignal((s) => s + 1);
                  try {
                    window.sessionStorage.removeItem('advSearch_state');
                    window.sessionStorage.removeItem('fromAdv');
                    window.sessionStorage.removeItem('appliedFilters');
                  } catch {
                    /* noop */
                  }
                  // fetch global total again (hook exposes helper)
                  fetchGlobalTotal();
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdvancedSearchPage;
