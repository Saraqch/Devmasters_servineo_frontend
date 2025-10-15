// src/app/jobOfert/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
import { useSearch } from '@/app/search/hooks/useSearch';
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

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Callback que hace la llamada a la API — lo pasamos al hook
  const handleJobSearchAPI = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<OfferResponse> = await api.get(
        `/api/devmaster/servicios?name=${encodeURIComponent(search)}&context=job_offer`
      );

      if (response.success && response.data) {
        setTrabajos(response.data.data || []);
        setPaginaActual(1);
      } else {
        setTrabajos([]);
        setError(response.error || 'Error al buscar servicios');
      }
    } catch (err) {
      setTrabajos([]);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  // Hook de búsqueda que maneja validaciones (min length) y expone handlers
  const {
    searchTerm,
    isSearchDisabled, // viene del hook pero lo sobreescribimos localmente para asegurar min 2 chars
    isMinLengthError,
    handleInputChange,
    handleSearch, // Llama a handleJobSearchAPI a través del hook
    handleClearSearch,
  } = useSearch(handleJobSearchAPI);

  // Nueva condición local: mínimo 2 caracteres + no estar en loading
  const isSearchDisabledLocal = searchTerm.trim().length < 2 || loading;

  // Cálculo de paginación local (índices)
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles = trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  // Reiniciar página cuando cambie registrosPorPagina
  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  const totalRegistros = trabajos.length; // puedes cambiar si la API te da el total real

  // submit del form: solo ejecutar si cumple la condición
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSearchDisabledLocal) {
      handleSearch();
    }
  };

  return (
    <main className="p-10 md:p-20 lg:p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Buscador: usamos <form> para poder disparar con Enter */}
      <form onSubmit={onSubmit} className="flex items-center justify-center gap-2 mb-6 w-full max-w-5xl mx-auto">
        <InputDemo value={searchTerm} onChange={handleInputChange} onClear={handleClearSearch} />

        {/* 
          - Funcionalmente deshabilitado cuando isSearchDisabledLocal === true
          - Visualmente no se ve opaco: usamos clases para mantener apariencia,
            pero cursor y comportamiento impedirán el clic.
        */}
        <SearchButton
          onClick={(e) => {
            e.preventDefault();
            if (!isSearchDisabledLocal) handleSearch();
          }}
          disabled={isSearchDisabledLocal}
          className={`px-4 py-2 rounded-lg text-white transition-all
            ${isSearchDisabledLocal ? 'bg-gray-500 cursor-not-allowed opacity-100' : 'bg-blue-600 hover:bg-blue-700'}`}
        />
      </form>

      {/* Mensaje de validación mínimo */}
      {searchTerm.length > 0 && searchTerm.trim().length < 2 && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '0.9rem' }}>
            Mínimo 2 caracteres para buscar
          </p>
        </div>
      )}

      {/* Mensaje de error API */}
      {error && <p className="text-center mb-4 text-sm text-red-500">{error}</p>}

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

      {/* Resultados visibles (según la página) */}
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
          totalRegistros={Math.max(totalRegistros, 1)}
          onChange={setPaginaActual}
        />
      </div>
    </main>
  );
}
