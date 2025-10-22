'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InputDemo } from '@/app/search/components_se/SearchBar';
import { SearchButton } from '@/app/search/components_se/SearchButton';
import { FilterButton } from '@/app/jobOfert/components_jo/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components_jo/FilterDrawer';
import Paginacion from './components_jo/Paginacion';
import PaginationInfo from './components_jo/PaginationInfo';
import PaginationSelector from './components_jo/PaginationSelector';
import CardJob from './components_jo/CardJob';
import SortCard from '@/components/sort/SortCard';
import { api, ApiResponse } from '@/lib/api';

interface OfferData {
  _id: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating: number;
}

interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
}

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

export default function JobOffers() {
  const [search, setSearch] = useState('');
  const [trabajos, setTrabajos] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    range: [],
    city: '',
    category: [],
  });
  const [sortBy, setSortBy] = useState<string>('recent');
  const defaultFilters: FilterState = { range: [], city: '', category: [] };
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  const fetchOffers = useCallback(async (
    searchText: string,
    appliedFilters: FilterState,
    appliedSort: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchText.trim()) {
        params.append('search', searchText);
      }

      if (appliedFilters.range && appliedFilters.range.length > 0) {
        appliedFilters.range.forEach((r) => {
          params.append('range', r);
        });
      }
      if (appliedFilters.city) {
        params.append('city', appliedFilters.city);
      }
      if (appliedFilters.category && appliedFilters.category.length > 0) {
        appliedFilters.category.forEach((c) => {
          params.append('category', c);
        });
      }

      if (appliedSort) {
        params.append('sortBy', appliedSort);
      }
      
      params.append('context', 'job_offer');

      const url = `/api/devmaster/offers?${params.toString()}`;
      const response: ApiResponse<OfferResponse> = await api.get(url);

      if (response.success && response.data) {
        setTrabajos(response.data.data);
        setPaginaActual(1);
      } else {
        const errorMsg = response.error || 'Error al cargar las ofertas';
        setError(errorMsg);
        setTrabajos([]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMsg);
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToInitial = () => {
    setFilters(defaultFilters);
    setSortBy('recent');
    setValidationMessage(null);
    fetchOffers('', defaultFilters, 'recent');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 100) {
      setSearch(value.slice(0, 100));
      setValidationMessage('Límite máximo de 100 caracteres');
      return;
    }

    setSearch(value);
    if (validationMessage === 'Límite máximo de 100 caracteres') {
      setValidationMessage(null);
    }
  };

  const handleSearch = async () => {
    setValidationMessage(null);
    const trimmedSearch = search.trim();

    if (trimmedSearch.length === 0) {
      setValidationMessage('Debe ingresar un término de búsqueda válido');
      return;
    }

    if (trimmedSearch.length < 2) {
      setValidationMessage('Introduce al menos dos caracteres para buscar.');
      return;
    }

    const allowedRegex = /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      setValidationMessage('Búsqueda invalida por contener caracteres especiales no permitidos. Solo se permiten los carateres especiales "," , "_" , " ." y "-"');
      return;
    }

    await fetchOffers(trimmedSearch, filters, sortBy);
  };

  useEffect(() => {
    fetchOffers('', { range: [], city: '', category: [] }, 'recent');
  }, [fetchOffers]);

  const handleFiltersApply = async (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
    await fetchOffers(search, appliedFilters, sortBy);
  };

  const sortMap: Record<string, string> = {
    Destacados: 'rating',
    'Los más recientes': 'recent',
    'Los más antiguos': 'oldest',
    'Nombre A-Z': 'name_asc',
    'Nombre Z-A': 'name_desc',
    'Num de contacto asc': 'contact_asc',
    'Num de contacto desc': 'contact_desc',
  };

  const sortMapInverse: Record<string, string> = Object.fromEntries(
    Object.entries(sortMap).map(([key, value]) => [value, key])
  );

  const handleSortChange = async (option: string) => {
    const backendSort = sortMap[option] || 'recent';
    setSortBy(backendSort);
    await fetchOffers(search, filters, backendSort);
  };

  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles =
    trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <h1 className="mt-8 sm:mt-12 md:mt-16 lg:mt-18 mb-0 sm:mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-12 lg:px-24">
        Ofertas de trabajo
      </h1>

      {/* Barra sticky - CAMBIO AQUÍ */}
      <div className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-2 sm:py-3 md:py-4 shadow-md mb-1 sm:mb-2 ${
        isDrawerOpen ? 'z-10' : 'z-50'
      }`}>
        {/* Fila 1: Filtro + Búsqueda + Botón - SIEMPRE EN UNA FILA */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {/* Botón de Filtros - tamaño fijo */}
          <div className="flex-shrink-0">
            <FilterButton onClick={toggleDrawer} />
          </div>

          {/* Barra de búsqueda - crece para llenar espacio */}
          <div className="flex-1 min-w-0">
            <InputDemo
              value={search}
              onChange={handleInputChange}
              onClear={() => {
                setSearch('');
                resetToInitial();
              }}
              onKeyDown={handleKeyDown}
              hasError={!!validationMessage}
            />
          </div>

          {/* Botón de Buscar - ancho fijo responsive */}
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <SearchButton onClick={handleSearch} disabled={loading} />
          </div>
        </div>

        {/* Mensaje de validación dentro del sticky */}
        {validationMessage && (
          <div className="mb-2 sm:mb-3 text-left">
            <p className="text-red-500 text-sm sm:text-base">{validationMessage}</p>
          </div>
        )}

        {/* Fila 2: Selector de paginación + Ordenamiento */}
        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <div className="w-full sm:w-auto">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={(valor) => setRegistrosPorPagina(valor)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <SortCard value={sortMapInverse[sortBy]} onSelect={handleSortChange} />
            </div>
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {error && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded text-sm sm:text-base">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded text-sm sm:text-base">
          Cargando ofertas...
        </div>
      )}
      
      <FilterDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-3 sm:mb-4">
          <div className="flex justify-center">
            <PaginationInfo
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
        {!loading && trabajosVisibles.length > 0 ? (
          <CardJob trabajos={trabajosVisibles} />
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl font-roboto font-normal">
              No se encontraron resultados
              {search.trim() && (
                <> para <span className="font-bold">&quot;{search.trim()}&quot;</span></>
              )}
            </p>
          </div>
        ) : null}
      </div>

      {!loading && trabajos.length > 0 && (
        <div className="mt-8 mb-24 flex justify-center">
          <Paginacion
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
            onChange={setPaginaActual}
          />
        </div>
      )}
    </main>
    </>
  );
}