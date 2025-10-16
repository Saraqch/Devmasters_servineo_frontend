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
  rating: number; // Añadido para el sorting por destacados
}

interface OfferResponse {
  total: number;
  data: OfferData[];
}

export default function JobOffers() {
  const [search, setSearch] = useState('');
  const [trabajos, setTrabajos] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  // 🔹 Manejar búsqueda
  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<OfferResponse> = await api.get(
        `/api/devmaster/servicios?name=${encodeURIComponent(search)}&context=job_offer`
      );

      if (response.success && response.data) {
        setTrabajos(response.data.data);
        setPaginaActual(1);
      } else {
        setError(response.error || 'Error al buscar servicios');
        setTrabajos([]);
      }
    } catch {
      setError('Error de conexión con el servidor');
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar filtros aplicados
  const handleFiltersApply = (filteredOffers: OfferData[]) => {
    setTrabajos(filteredOffers);
    setPaginaActual(1);
  };

  // 🔹 Calcular trabajos visibles según página actual y registros por página
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles =
    trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  // 🔹 Reiniciar página si el selector cambia
  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  return (
    <main className="p-10 md:p-20 lg:p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Buscador + Botón de Filtros */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <SortCard
          onSelect={async (option) => {
            const sortMap: Record<string, string> = {
              Destacados: 'rating',
              'Los más recientes': 'recent',
              'Los más antiguos': 'oldest',
              'Nombre A-Z': 'name_asc',
              'Nombre Z-A': 'name_desc',
              'Num de contacto asc': 'contact_asc',
              'Num de contacto desc': 'contact_desc',
            };
            const backendSort = sortMap[option];

            setLoading(true);
            try {
              const res = await fetch(`/api/devmaster/fixers?sortBy=${backendSort}`);
              const data = await res.json();
              if (data.success) {
                setTrabajos(data.data || []); // Actualiza la lista completa
                setPaginaActual(1);
              } else {
                setTrabajos([]);
              }
            } catch {
              setTrabajos([]);
            } finally {
              setLoading(false);
            }
          }}
        />
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
          <p className="text-gray-500">No hay resultados en esta página</p>
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