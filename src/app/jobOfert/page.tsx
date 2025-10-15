'use client';

import { useState, useEffect } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import Paginacion from '../../components/Offers/Paginacion';
import PaginationInfo from '../../components/Offers/PaginationInfo';
import PaginationSelector from '../../components/Offers/PaginationSelector';
import CardJob from '../../components/Offers/CardJob';
import { api, ApiResponse } from '@/lib/api';

interface JobResponse {
  total: number;
  data: JobData[];
}

interface JobData {
  _id: string;
  title: string;
  description: string;
  status: string;
  price: number;
  createdAt: string;
  comment?: string;
}

export default function JobOffers() {
  const [search, setSearch] = useState('');
  const [trabajos, setTrabajos] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Para prueba: total de registros aunque no haya resultados
  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  // 🔹 Manejar búsqueda
  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<JobResponse> = await api.get(
        `/api/devmaster/servicios?name=${search}&context=job`
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

      {/* Buscador */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <SearchButton onClick={handleSearch} disabled={loading} />
      </div>

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





