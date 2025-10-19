'use client';

import { useState, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState('');
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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showTopButton, setShowTopButton] = useState(false); // nuevo estado

  // --- Queries ---
  const {
    data: initialData,
    isLoading: isLoadingInitial,
    error: errorInitial,
  } = useGetOffersQuery({ limit: 10, sortBy }, { skip: isAdvancedQuery });

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

  // --- Determinar qué trabajos mostrar ---
  const trabajos = isAdvancedQuery
    ? advancedData?.data || []
    : initialData?.data?.slice(0, 10) || [];

  const totalRegistros = isAdvancedQuery ? trabajos.length : initialData?.data?.length || 0;

  // --- Paginación solo si es query avanzada ---
  const indiceInicio = isAdvancedQuery ? (paginaActual - 1) * registrosPorPagina : 0;
  const indiceFin = isAdvancedQuery ? indiceInicio + registrosPorPagina : trabajos.length;
  const trabajosVisibles = trabajos.slice(indiceInicio, indiceFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  // --- Mostrar botón de top según scroll ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Handlers ---
  const handleSearch = () => {
    const trimmedSearch = inputValue.trim();

    if (trimmedSearch.length === 0) {
      setValidationMessage('Debe ingresar un término de búsqueda válido');
      setIsAdvancedQuery(false);
      setSearch('');
      return;
    }

    if (trimmedSearch.length < 2) {
      setValidationMessage('Introduce al menos dos caracteres para buscar.');
      return;
    }

    const allowedRegex = /^[A-Za-z0-9,_. -]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      setValidationMessage('Búsqueda inválida');
      return;
    }

    setValidationMessage(null);
    setSearch(trimmedSearch);
    setIsAdvancedQuery(true);
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

  const tituloResultados = isAdvancedQuery
    ? 'Resultados de búsqueda'
    : `Mostrando los ${trabajos.length > 0 ? trabajos.length : 0} ${
        trabajos.length > 1 ? 'primeros' : 'primer'
      }`;

  return (
    <main className="p-6 md:p-12 lg:p-24">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Barra superior: Filtro + Buscador + Botón */}
      <div className="w-full max-w-5xl mx-auto px-6 mb-4">
        <div className="flex items-stretch gap-2">
          <div className="self-stretch">
            <FilterButton onClick={() => setIsDrawerOpen(true)} />
          </div>
          <div className="flex-1">
            <InputDemo
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setValidationMessage(null); // limpiar mensaje al escribir
              }}
              onBlur={() => {
                if (inputValue.trim() === '') {
                  setValidationMessage(null); // limpiar mensaje al salir del input vacío
                }
              }}
              onClear={() => {
                setInputValue('');
                setSearch('');
                setFilters({ range: [], city: '', category: [] });
                setIsAdvancedQuery(false);
                setValidationMessage(null);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <SearchButton onClick={handleSearch} disabled={isLoading} />
        </div>
      </div>

      {/* Mensajes */}
      {validationMessage && (
        <div className="w-full max-w-5xl mx-auto text-center">
          <p className="text-gray-500">{validationMessage}</p>
        </div>
      )}
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

      {/* Drawer de filtros */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {/* Selector de registros y sort (layout uniforme) */}
      {!isLoading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-6 flex justify-between items-center">
          {/* Sort siempre visible */}
          <SortCard onSelect={handleSortChange} />

          {/* Selector de registros, solo si query avanzada */}
          <div className="transition-all duration-300">
            {isAdvancedQuery ? (
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={(valor) => setRegistrosPorPagina(valor)}
              />
            ) : (
              // Placeholder para mantener altura/alineación
              <div className="w-[120px] h-[40px]" />
            )}
          </div>
        </div>
      )}

      {/* Info de paginación */}
      {!isLoading && trabajos.length > 0 && isAdvancedQuery && (
        <div className="w-full max-w-5xl mx-auto px-6 flex justify-center">
          <PaginationInfo
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
          />
        </div>
      )}

      {/* Resultados */}
      <div className="w-full max-w-5xl mx-auto px-6">
        {!isLoading && trabajosVisibles.length > 0 ? (
          <CardJob trabajos={trabajosVisibles} title={tituloResultados} />
        ) : !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl font-roboto font-normal">
              No se encontraron resultados
              {search.trim() && (
                <>
                  {' '}
                  para <span className="font-bold">&quot;{search.trim()}&quot;</span>
                </>
              )}
            </p>
          </div>
        ) : null}
      </div>

      {/* Paginación inferior */}
      {!isLoading && trabajos.length > 0 && isAdvancedQuery && (
        <div className="mt-8 flex justify-center">
          <Paginacion
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
            onChange={setPaginaActual}
          />
        </div>
      )}

      {/* Botón volver al top */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          ↑ Top
        </button>
      )}
    </main>
  );
}
