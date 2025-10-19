'use client';

import { useRef, useState, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import { FilterButton } from '@/app/jobOfert/components/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components/FilterDrawer';
import Paginacion from './components/Paginacion';
import PaginationInfo from './components/PaginationInfo';
import PaginationSelector from './components/PaginationSelector';
import CardJob from './components/CardJob';
import SortCard from '@/Components/sort/SortCard';
import { useGetOffersQuery } from './lib/api/jobOfert.api';
import type { OfferData } from './lib/api/jobOfert.api';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

export default function JobOffers() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    range: [],
    city: '',
    category: [],
  });
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [isAdvancedQuery, setIsAdvancedQuery] = useState(false);

  // --- Query inicial (solo 10 ofertas) ---
  const {
    data: initialData,
    isLoading: isLoadingInitial,
    error: errorInitial,
  } = useGetOffersQuery({ limit: 10, sortBy }, { skip: isAdvancedQuery });

  // --- Query avanzada (toda la data) ---
  const queryParams = isAdvancedQuery
    ? {
        search: search.trim(),
        range: filters.range,
        city: filters.city,
        category: filters.category,
        sortBy,
      }
    : skipToken;

  const {
    data: advancedData,
    isLoading: isLoadingAdvanced,
    error: errorAdvanced,
  } = useGetOffersQuery(queryParams as any);

  // --- Selección de datos a mostrar ---
  const trabajos = isAdvancedQuery ? advancedData?.data || [] : initialData?.data || [];
  const totalRegistros = trabajos.length;

  // --- Paginación ---
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles = trabajos.slice(indiceInicio, indiceFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  // --- Handlers ---
  const handleSearch = () => {
    if (
      search.trim() === '' &&
      filters.city === '' &&
      filters.category.length === 0 &&
      filters.range.length === 0
    ) {
      setIsAdvancedQuery(false);
    } else {
      setIsAdvancedQuery(true);
    }
    setPaginaActual(1);
  };

  const handleFiltersApply = (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
    const hasFilters =
      appliedFilters.city !== '' ||
      appliedFilters.category.length > 0 ||
      appliedFilters.range.length > 0;
    setIsAdvancedQuery(hasFilters || search.trim() !== '');
    setPaginaActual(1);
  };

  const handleSortChange = (option: string) => {
    const sortMap: Record<string, string> = {
      Destacados: 'rating',
      'Los más recientes': 'recent',
      'Los más antiguos': 'oldest',
      'Nombre A-Z': 'name_asc',
      'Nombre Z-A': 'name_desc',
      'Num de contacto asc': 'contact_asc',
      'Num de contacto desc': 'contact_desc',
    };
    setSortBy(sortMap[option] || 'recent');
    setPaginaActual(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // --- Manejo de errores/loading ---
  const errorMessage = errorInitial
    ? 'error' in errorInitial
      ? ((errorInitial as any).data?.message ?? 'Error al cargar las ofertas')
      : 'Error de conexión'
    : errorAdvanced
      ? 'error' in errorAdvanced
        ? ((errorAdvanced as any).data?.message ?? 'Error al cargar las ofertas')
        : 'Error de conexión'
      : null;

  const isLoading = isAdvancedQuery ? isLoadingAdvanced : isLoadingInitial;

  // --- Determinar título ---
  const tituloResultados = isAdvancedQuery
    ? 'Resultados de búsqueda'
    : `Mostrando los ${trabajos.length > 0 ? Math.min(trabajos.length, 10) : 0} ${
        trabajos.length > 1 ? 'primeros' : 'primer'
      }`;

    const ref = useRef<HTMLDivElement>(null);
    const [atTop, setAtTop] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        if (ref.current) {
          setAtTop(ref.current.getBoundingClientRect().top <= 0);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const paddingClass = atTop ? 'md:p-2 p-3' : 'md:p-4 p-3';

  // --- Render ---
  return (
    <main className="p-10 md:p-20 lg:p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Controles superiores */}
      <div
        ref={ref}
        className={`sticky top-0 z-50 bg-white ${paddingClass} flex flex-wrap items-center justify-center gap-4 border border-gray-200 shadow-md rounded-2xl`}
      >
        <SortCard onSelect={handleSortChange} />
        <FilterButton onClick={() => setIsDrawerOpen(true)} />
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => {
            setSearch('');
            setFilters({ range: [], city: '', category: [] });
            setIsAdvancedQuery(false);
          }}
          onKeyDown={handleKeyDown}
        />
        <SearchButton onClick={handleSearch} disabled={isLoading} />
      </div>

      {/* Drawer de filtros */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {/* Mensajes */}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">
          Error: {errorMessage}
        </div>
      )}
      {isLoading && (
        <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
          Cargando ofertas...
        </div>
      )}

      {/* Paginación superior */}
      {(trabajos.length > registrosPorPagina || isAdvancedQuery) && (
        <div className="flex justify-between items-center mb-4 w-full max-w-5xl mx-auto">
          <PaginationInfo
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
          />
          <PaginationSelector
            registrosPorPagina={registrosPorPagina}
            onChange={(valor) => setRegistrosPorPagina(valor)}
          />
        </div>
      )}

      {/* Resultados */}
      <CardJob trabajos={trabajosVisibles} title={tituloResultados} />

      {/* Paginación inferior */}
      {!isLoading && trabajos.length > registrosPorPagina && (
        <div className="mt-8 flex justify-center">
          <Paginacion
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
            onChange={setPaginaActual}
          />
        </div>
      )}
    </main>
  );
}
