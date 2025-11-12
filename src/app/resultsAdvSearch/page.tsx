'use client';
import React, { Suspense } from 'react';
import Header from '../../Components/ResultsAdvSearch/Header';
import Footer from '../../Components/ResultsAdvSearch/Footer';
import AppliedFilters from '../../Components/ResultsAdvSearch/AppliedFilters';
import useAppliedFilters from '../job-offers/hooks/useAppliedFilters';

// Reutilizamos las cards y componentes de paginación desde job-offer
import { CardJob, Paginacion, PaginationInfo, PaginationSelector } from '../job-offers';

// Store hooks y acciones
import { useAppDispatch, useAppSelector } from '../job-offers/hooks/hook';
import { fetchOffers, setRegistrosPorPagina, setPaginaActual } from '../job-offers/lib/slice';
import { useInitialUrlParams } from '../job-offers/hooks/useInitialUrlParams';
import { useSyncUrlParams } from '../job-offers/hooks/useSyncUrlParams';

export default function ResultsAdvSearchPage() {
  const dispatch = useAppDispatch();
  // Only destructure what we need - appliedParams
  const { appliedParams } = useAppliedFilters();

  // Inicializar la página a partir de los query params (viene de AdvSearch)
  useInitialUrlParams();

  // Leer estado compartido de jobOffers
  const {
    trabajos,
    loading,
    filters,
    sortBy,
    search,
    titleOnly,
    exact,
    paginaActual,
    registrosPorPagina,
    totalRegistros,
    date,
    rating,
  } = useAppSelector((s) => s.jobOffers);

  const handlePageChange = (newPage: number) => {
    // optimistically update current page in store so UI updates immediately
    dispatch(setPaginaActual(newPage));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: newPage,
        limit: registrosPorPagina,
        titleOnly,
        exact,
        listKey: 'offers',
      }),
    );
  };

  const handleRegistrosChange = (valor: number) => {
    // Actualiza el tamaño de página y realiza fetch en la página 1
    dispatch(setRegistrosPorPagina(valor));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: 1,
        limit: valor,
        titleOnly,
        exact,
        listKey: 'offers',
      }),
    );
  };

  // Mantener sincronizada la URL con el estado (página, limit, filtros, etc.)
  useSyncUrlParams({
    search,
    filters,
    sortBy,
    date,
    rating,
    paginaActual,
    registrosPorPagina,
    titleOnly,
    exact,
  });

  return (
    <Suspense fallback={<div />}>
      <>
        <Header />
        <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
          <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
            Resultados de Búsqueda Avanzada
          </h1>

          {/* Filtros aplicados: renderizo siempre el contenedor para evitar
            desajustes de hidratación entre servidor/cliente. Si no hay
            appliedParams se pasa un objeto vacío (no se muestran tags). */}
          <AppliedFilters params={appliedParams ?? {}} />

          {/* Selector y resumen de paginación (components de job-offer) */}
          {/* Alinéo el selector con el mismo ancho y padding que AppliedFilters */}
          <div className="w-full max-w-5xl mx-auto mt-4 px-4 mb-2">
            <PaginationSelector
              registrosPorPagina={registrosPorPagina}
              onChange={handleRegistrosChange}
            />
          </div>

          <div className="flex justify-center my-4">
            <PaginationInfo
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
            />
          </div>

          {/* Cards de resultados (reutilizadas) */}
          <div className="w-full max-w-5xl mx-auto">
            {!loading && trabajos && trabajos.length > 0 ? (
              <CardJob trabajos={trabajos} />
            ) : !loading ? (
              <div className="text-gray-500 text-center">No se encontraron resultados</div>
            ) : (
              <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
                Cargando resultados...
              </div>
            )}
          </div>

          {/* Paginación inferior (reutilizada) */}
          {!loading && trabajos && trabajos.length > 0 && (
            <div className="mt-8 mb-24 flex justify-center">
              <Paginacion
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
                totalRegistros={totalRegistros}
                onChange={handlePageChange}
              />
            </div>
          )}
        </main>
        <Footer />
      </>
    </Suspense>
  );
}
