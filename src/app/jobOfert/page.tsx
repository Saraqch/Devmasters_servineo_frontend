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

      {/* Barra sticky */}
      <div className="`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-2 sm:py-3 md:py-4 shadow-md mb-1 sm:mb-2 ${
        isDrawerOpen ? 'z-10' : 'z-50'">
        {/* Fila 1: Filtro + Búsqueda + Botón + Ordenacion */}
        <div className="flex flex-col gap-2 sm:flex-row items-stretch mb-3 sm:mb-4">
          <div className="self-stretch w-full sm:w-auto">
            <FilterButton onClick={toggleDrawer} />
          </div>

          <div className="flex-1 w-full">
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

          <div className="w-full sm:w-auto">
            <SearchButton onClick={handleSearch} disabled={loading} className="w-full sm:w-auto" />
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