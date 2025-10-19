'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import { FilterButton } from '@/app/jobOfert/components/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components/FilterDrawer';
import Paginacion from './components/Paginacion';
import PaginationInfo from './components/PaginationInfo';
import PaginationSelector from './components/PaginationSelector';
import CardJob from './components/CardJob';
// NOTA: Usé '@/components/sort/SortCard' en minúsculas por seguridad
// Si esto causa un error de importación, usa '@/Components/sort/SortCard'
import SortCard from '@/Components/sort/SortCard';
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
  // Estados de filtro y ordenamiento agregados de 'dev'
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

      if (searchText.trim()) {
        params.append('search', searchText);
      }

      // Lógica de filtros
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

      // Lógica de ordenamiento
      if (appliedSort) {
        params.append('sortBy', appliedSort);
      }
      
      params.append('context', 'job_offer'); // Asegura que el endpoint sea correcto

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

    setSearch(value);
    if (validationMessage === 'Límite máximo de 100 caracteres') {
      setValidationMessage(null);
    }
  };

  // --- Manejar Búsqueda (Combinación de validación y llamada a fetchOffers) ---
  const handleSearch = async () => {
    // 1. Limpieza y validaciones (de 'MelCambios')
    setValidationMessage(null);
    const trimmedSearch = search.trim();

    if (trimmedSearch.length === 0) {
      // Si no hay texto, volvemos al estado inicial (lista por defecto)
      resetToInitial();
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

  // Manejar cambio de sort (de 'dev')
  const handleSortChange = async (option: string) => {
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
  }, [registrosPorPagina]);

  // Manejar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <main className={`p-6 md:p-12 lg:p-24 ${isDrawerOpen ? 'overflow-hidden' : ''}`}>
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Barra superior: Filtros + Búsqueda + Botón Buscar */}
      <div className="w-full max-w-5xl mx-auto px-6 mb-4">
        <div className="flex items-stretch gap-2">
          {/* Filtro a la izquierda */}
          <div className="self-stretch">
            <FilterButton onClick={() => setIsDrawerOpen(true)} />
          </div>

          {/* Buscador expandible */}
          <div className="flex-1">
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
          <SearchButton onClick={handleSearch} disabled={loading} />
        </div>
      </div>

      {/* Mensaje de validación (debajo del buscador) */}
      {validationMessage && (
        <div className="w-full max-w-5xl mx-auto mb-3 text-center">
          <p className="text-gray-500">{validationMessage}</p>
        </div>
      )}

      {/* Error de la API */}
      {error && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
          Cargando ofertas...
        </div>
      )}
      
      {/* FilterDrawer */}
      <FilterDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {/* Fila 2: Selector "Mostrar X" (izq) + Ordenamiento (der) */}
      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-6 mb-4">
          <div className="flex justify-between items-center">
            <PaginationSelector
              registrosPorPagina={registrosPorPagina}
              onChange={(valor) => setRegistrosPorPagina(valor)}
            />
            <SortCard onSelect={handleSortChange} />
          </div>
        </div>
      )}

      {/* Info de resultados centrada */}
      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-6 mb-4">
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
      <div className="w-full max-w-5xl mx-auto px-6">
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

      {/* Paginación */}
      {!loading && trabajos.length > 0 && (
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