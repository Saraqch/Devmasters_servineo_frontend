'use client';
import React, { useEffect, useRef } from 'react';
import Header from './components_RAS/Header';
import Footer from './components_RAS/Footer';
import PaginationInfo from './components_RAS/PaginationInfo';
import PaginationSelector from './components_RAS/PaginationSelector';
import Paginacion from './components_RAS/Paginacion';
import AppliedFilters from './components_RAS/AppliedFilters';
import useAppliedFilters from '../jobOfert/hooks/useAppliedFilters';

import { CardJob, NoResultsMessage } from '@/app/jobOfert/components_jo';
import { useAppDispatch, useAppSelector } from '@/app/jobOfert/hooks/hook';
import { fetchOffers, setRegistrosPorPagina } from '@/app/jobOfert/lib/slice';
import useApplyQueryToStore from '@/app/jobOfert/hooks/useApplyQueryToStore';
import { useSyncUrlParams } from '@/app/jobOfert/hooks/useSyncUrlParams';

export default function ResultsAdvSearchPage() {
  const dispatch = useAppDispatch();
  const {
    trabajos,
    loading,
    error,
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
  } = useAppSelector((state) => state.jobOffers);

  const { showAppliedFilters, appliedParams } = useAppliedFilters();
  const isInitialMount = useRef(true);

  // Apply URL query to store on mount and trigger fetch
  useApplyQueryToStore();

  // Sync store -> URL for pagination/sort changes
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

  // initial fetch when no query in URL
  useEffect(() => {
    if (!isInitialMount.current) return;
    if (typeof window !== 'undefined' && window.location.search && window.location.search !== '') {
      isInitialMount.current = false;
      return;
    }

    dispatch(
      fetchOffers({
        searchText: '',
        filters: { range: [], city: '', category: [] },
        sortBy: 'recent',
        page: 1,
        limit: 10,
      }),
    );
    isInitialMount.current = false;
  }, [dispatch]);

  // Cambiar cantidad de registros por página
  const handleRegistrosChange = (valor: number) => {
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
      }),
    );
  };

  // Cambiar página
  const handlePageChange = (num: number) => {
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: num,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Resultados de Búsqueda Avanzada
        </h1>

        {/* Filtros aplicados (si vienen desde la búsqueda avanzada) */}
        {showAppliedFilters && appliedParams && (
          <AppliedFilters params={appliedParams} />
        )}

        {/* Componente selector de registros por página - alineado con el card de filtros */}
        <div className="w-full max-w-5xl mx-auto mt-4 px-4">
          <PaginationSelector registrosPorPagina={registrosPorPagina} onChange={handleRegistrosChange} />
        </div>

        {/* Componente de información de paginación - Ahora en el medio */}
        <div className="flex justify-center my-4">
          <PaginationInfo paginaActual={paginaActual} registrosPorPagina={registrosPorPagina} totalRegistros={totalRegistros} />
        </div>

        {/* Cards */}
        <div className="w-full max-w-5xl mx-auto">
          {!loading && trabajos && trabajos.length > 0 ? (
            <CardJob trabajos={trabajos} />
          ) : !loading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {/* Componente de botones de paginación */}
        {(!loading && trabajos && trabajos.length > 0) && (
          <div className="mt-8 mb-24 flex justify-center">
            <Paginacion paginaActual={paginaActual} registrosPorPagina={registrosPorPagina} totalRegistros={totalRegistros} onChange={handlePageChange} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}



