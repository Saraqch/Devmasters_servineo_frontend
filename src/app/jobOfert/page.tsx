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
  // Filtros por defecto para estado inicial
  const defaultFilters: FilterState = { range: [], city: '', category: [] };

  // estado para mensajes de validación (de 'MelCambios')
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Estados de paginación
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

  // NOTA: Usamos el total real de la API si estuviera disponible, o una constante
  // En tu código, usaste trabajos.length o 100, mantendremos la lógica.
  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  // --- Función central para hacer la llamada al backend (Unificada de 'dev') ---
  const fetchOffers = useCallback(async (
    searchText: string,
    appliedFilters: FilterState,
    appliedSort: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMsg);
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper: volver al estado inicial (lista por defecto)
  const resetToInitial = () => {
    setFilters(defaultFilters);
    setSortBy('recent');
    setValidationMessage(null);
    // llamar la carga inicial
    fetchOffers('', defaultFilters, 'recent');
  };


  // --- Manejar el cambio de input y límite de 100 caracteres (de 'MelCambios') ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 100) {
      setSearch(value.slice(0, 100));
      setValidationMessage('Límite máximo de 100 caracteres');
      return;
    }

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

    const allowedRegex = /^[A-Za-z0-9áéíóúÁÉÍÓÚüÜñÑ,_. -]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      setValidationMessage('Búsqueda inválida');
      return;
    }

    // 2. Si pasa, llama al fetcher (de 'dev')
  await fetchOffers(trimmedSearch, filters, sortBy);
  };

  // Cargar ofertas iniciales al montar el componente
  // Carga inicial de ofertas al montar el componente
  useEffect(() => {
    // Llama al fetcher sin búsqueda, con filtros por defecto y sort 'recent'
  fetchOffers('', { range: [], city: '', category: [] }, 'recent');
  }, [fetchOffers]);

  // Manejar filtros aplicados (de 'dev')
  const handleFiltersApply = async (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
  await fetchOffers(search, appliedFilters, sortBy);
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

    const backendSort = sortMap[option] || 'recent';
    setSortBy(backendSort);
  await fetchOffers(search, filters, backendSort);
  };

  // Calcular trabajos visibles según página actual
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles =
    trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  // Reiniciar página si el selector cambia
  useEffect(() => {
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
  <main className={`p-2 sm:p-6 md:p-12 lg:p-24 ${isDrawerOpen ? 'overflow-hidden' : ''}`}>
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Barra superior: Filtros + Búsqueda + Botón Buscar */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-4">
        <div className="flex flex-col gap-2 sm:flex-row items-stretch">
          {/* Filtro, input y botón */}
          {/* Filtro a la izquierda */}
          <div className="self-stretch w-full sm:w-auto">
            <FilterButton onClick={() => setIsDrawerOpen(true)} />
          </div>

          {/* Buscador expandible */}
          <div className="flex-1 w-full">
            <InputDemo
              value={search}
              onChange={handleInputChange}
              onClear={() => {
                setSearch('');
                // Al borrar con la X, volvemos al estado inicial
                resetToInitial();
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Botón Buscar */}
          <div className="w-full sm:w-auto">
            <SearchButton onClick={handleSearch} disabled={loading} className="w-full sm:w-auto" />
          </div>
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

      {/* Fila 2: Selector "Mostrar X" (izq) + Ordenamiento (der) */}
      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-4">
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <div className="w-full sm:w-auto">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={(valor) => setRegistrosPorPagina(valor)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <SortCard onSelect={handleSortChange} />
            </div>
          </div>
        </div>
      )}

      {/* Info de resultados centrada */}
      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-4">
          <div className="flex justify-center">
            <PaginationInfo
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
            />
          </div>
        </div>
      )}

      {/* Resultados */}
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
