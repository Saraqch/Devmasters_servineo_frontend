'use client';

import { useState } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import Paginacion from './components/Paginacion';
import CardJob from './components/CardJob';
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
      } else {
        setError(response.error || 'Error al buscar servicios');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Ofertas de trabajo
      </h1>

      {/* Buscador usando tus componentes */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <SearchButton onClick={handleSearch} disabled={loading} />
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Cards de resultados */}
      <div className="flex flex-wrap gap-4 justify-center">
        <CardJob trabajos={trabajos} />
      </div>

      <div className="mt-6">
        <Paginacion />
      </div>
    </main>
  );
}
