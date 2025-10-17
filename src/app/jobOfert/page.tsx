// src/app/jobOfert/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { InputDemo } from '@/app/search/components/SearchBar';
import { SearchButton } from '@/app/search/components/SearchButton';
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

  // estado para mensajes de validación (no errores de la API)
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Para prueba: total de registros aunque no haya resultados
  const totalRegistros = trabajos.length > 0 ? trabajos.length : 100;

  // --- Nuevo: manejar cambio de input y límite máximo de 100 caracteres ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 100) {
      // Si excede, solo tomamos los primeros 100 caracteres y mostramos mensaje
      setSearch(value.slice(0, 100));
      setValidationMessage('Límite máximo de 100 caracteres');
      return;
    }

    // Si está dentro del límite, actualizamos y eliminamos mensaje de límite si existía
    setSearch(value);
    // Si el mensaje mostrado es el de límite, lo borramos cuando baja de 100
    if (validationMessage === 'Límite máximo de 100 caracteres') {
      setValidationMessage(null);
    }
  };

  // Manejar búsqueda con validación mínima y de caracteres permitidos
  const handleSearch = async () => {
    // Limpiamos mensaje de validación al inicio
    setValidationMessage(null);

    const trimmedSearch = search.trim();

    // Validación: campo vacío → mensaje exacto solicitado
    if (trimmedSearch.length === 0) {
      setValidationMessage('Debe ingresar un término de búsqueda válido');
      return;
    }

    // Validación: mínimo 2 caracteres (se mantiene)
    if (trimmedSearch.length < 2) {
      setValidationMessage('Introduce al menos dos caracteres para buscar.');
      return;
    }

    // NUEVA VALIDACIÓN: solo caracteres permitidos: A-Z a-z 0-9 , _ . -
    // Regex permite una o más de los caracteres indicados, sin espacios ni otros símbolos.
    const allowedRegex = /^[A-Za-z0-9,_.-]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      setValidationMessage('Búsqueda inválida');
      return;
    }

    // Si pasa validación, continúa con la lógica de la API
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<OfferResponse> = await api.get(
        `/api/devmaster/servicios?name=${encodeURIComponent(trimmedSearch)}&context=job_offer`
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

  // Calcular trabajos visibles según página actual y registros por página
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const trabajosVisibles =
    trabajos.length > 0 ? trabajos.slice(indiceInicio, indiceFin) : [];

  // Reiniciar página si el selector cambia
  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  // --- Manejar Enter (no cambiaremos eso) ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <main className="p-10 md:p-20 lg:p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">Ofertas de trabajo</h1>

      {/* Buscador */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <InputDemo
          value={search}
          onChange={handleInputChange} // <- reemplazado por handleInputChange (control de 100 chars)
          onClear={() => {
            setSearch('');
            // limpiar mensajes de validación al limpiar input
            setValidationMessage(null);
          }}
          onKeyDown={handleKeyDown}
        />
        <SearchButton onClick={handleSearch} disabled={loading} />
      </div>

      {/* Mensaje de validación (debajo del buscador, antes del error de la API) */}
      {validationMessage && (
        <div className="w-full max-w-5xl mx-auto mb-3 text-center">
          <p className="text-gray-500">{validationMessage}</p>
        </div>
      )}

      {/* Error de la API */}
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
