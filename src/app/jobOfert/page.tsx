'use client';

import { useState } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import Paginacion from './components/Paginacion';
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
        Servicios disponibles
      </h1>

      {/* Buscador */}
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

      {/* Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        <CardJob trabajos={trabajos} />
      </div>

      <div className="mt-6">
        <Paginacion />
      </div>
    </main>
  );
}
