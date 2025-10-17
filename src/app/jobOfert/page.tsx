'use client';

import { useState, useEffect } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import { FilterButton } from '@/app/jobOfert/components/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components/FilterDrawer';
import Paginacion from './components/Paginacion';
import PaginationInfo from './components/PaginationInfo';
import PaginationSelector from './components/PaginationSelector';
import CardJob from './components/CardJob';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    range: [],
    city: '',
    category: [],
  });
  const [sortBy, setSortBy] = useState<string>('');

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  // 🔹 Función para hacer la llamada al backend con todos los parámetros
  const fetchOffers = async (
    searchText: string = '',
    appliedFilters: FilterState = filters,
    appliedSort: string = sortBy,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchText.trim()) {
        params.append('search', searchText);
      }

      // Añadir rangos (múltiples)
      appliedFilters.range.forEach((r) => {
        params.append('range', r);
      });

      // Añadir ciudad (single)
      if (appliedFilters.city) {
        params.append('city', appliedFilters.city);
      }

      // Añadir categorías (múltiples)
      appliedFilters.category.forEach((c) => {
        params.append('category', c);
      });

      // Añadir sort
      if (appliedSort) {
        params.append('sortBy', appliedSort);
      }

      const response: ApiResponse<OfferResponse> = await api.get(
        `/api/devmaster/offers?${params.toString()}`,
      );

      if (response.success && response.data) {
        setTrabajos(response.data.data);
        setPaginaActual(1);
      } else {
        setError(response.error || 'Error al cargar las ofertas');
        setTrabajos([]);
      }
    } catch {
      setError('Error de conexión con el servidor');
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Manejar búsqueda
  const handleSearch = async () => {
    if (!search.trim()) return;
    await fetchOffers(search, filters, sortBy);
  };

  // 🔹 Manejar filtros aplicados
  const handleFiltersApply = async (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
    await fetchOffers(search, appliedFilters, sortBy);
  };

  // 🔹 Manejar cambio de sort
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
    const backendSort = sortMap[option] || '';
    setSortBy(backendSort);
    await fetchOffers(search, filters, backendSort);
  };

  // 🔹 Calcular trabajos visibles según página actual
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles = trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  // 🔹 Reiniciar página si el selector cambia
  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  return (
    <main className="p-10 md:p-20 lg:p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Buscador + Botón de Filtros */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <SortCard onSelect={handleSortChange} />
        <FilterButton onClick={() => setIsDrawerOpen(true)} />
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <SearchButton onClick={handleSearch} disabled={loading} />
      </div>

      {/* FilterDrawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Loading */}
      {loading && <p className="text-blue-500 text-center mb-4">Cargando...</p>}

      {/* Info de paginación + Selector */}
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

      {/* Resultados */}
      <div className="flex flex-wrap gap-4 justify-center">
        {trabajosVisibles.length > 0 ? (
          <CardJob trabajos={trabajosVisibles} />
        ) : (
          <p className="text-gray-500">
            {trabajos.length === 0 ? 'No hay resultados' : 'No hay resultados en esta página'}
          </p>
        )}
      </div>

      {/* Paginación */}
      <div className="mt-8 flex justify-center">
        <Paginacion
          paginaActual={paginaActual}
          registrosPorPagina={registrosPorPagina}
          totalRegistros={totalRegistros}
          onChange={setPaginaActual}
        />
      </div>
    </main>
  );
}
