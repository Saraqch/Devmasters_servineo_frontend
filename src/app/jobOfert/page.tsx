// src/app/jobOfert/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  SearchBar,
  NoResultsMessage,
  FilterButton,
  FilterDrawer,
  Paginacion,
  PaginationInfo,
  PaginationSelector,
  CardJob,
  SortCard,
  Header,
  Footer,
} from '@/app/jobOfert/components_jo';

import { useAppDispatch, useAppSelector } from './hooks/hook';
import {
  fetchOffers,
  setSearch,
  setFilters,
  setSortBy,
  setRegistrosPorPagina,
  FilterState,
} from './lib/slice';
import { getSortValue, sortMapInverse } from './lib/constants/sortOptions';
import { useSyncUrlParams } from './hooks/useSyncUrlParams';
import { useInitialUrlParams } from './hooks/useInitialUrlParams';

export default function JobOffersPage() {
  const dispatch = useAppDispatch();
  const {
    trabajos,
    loading,
    error,
    filters,
    sortBy,
    search,
    paginaActual,
    registrosPorPagina,
    totalRegistros,
  } = useAppSelector((state) => state.jobOffers);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);
   const isInitialMount = useRef(true);
  // Hook para leer parámetros iniciales de la URL
  useInitialUrlParams();

  // Sincroniza URL con el estado
  useSyncUrlParams({
    search,
    filters,
    sortBy,
    paginaActual,
    registrosPorPagina,
  });

  // --- Carga inicial ---
  useEffect(() => {
    if (isInitialMount.current) {
      dispatch(
        fetchOffers({
          searchText: search,
          // filters: { range: [], city: '', category: [] },
          filters: filters,
          // sortBy: 'recent',
          sortBy: sortBy,
          page: paginaActual,
          limit: registrosPorPagina,
        }),
      );
      isInitialMount.current = false;
    }
  }, [dispatch,search, filters, sortBy, paginaActual, registrosPorPagina]);
  // --- Sticky header handler ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const hdr = document.querySelector('header');
      const h = hdr ? (hdr as HTMLElement).getBoundingClientRect().height : 0;
      if (stickyRef.current) {
        stickyRef.current.style.top = `${h}px`;
        stickyRef.current.style.zIndex = '40';
      }
    };

    update();
    window.addEventListener('resize', update);

    const hdrEl = document.querySelector('header');
    const mo = hdrEl ? new MutationObserver(update) : null;
    if (mo && hdrEl) mo.observe(hdrEl, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', update);
      if (mo) mo.disconnect();
    };
  }, []);

  // --- Handlers ---
  const handleRegistrosPorPaginaChange = (valor: number) => {
    dispatch(setRegistrosPorPagina(valor));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        page: 1,
        limit: valor,
      }),
    );
  };

  const handleFiltersApply = (appliedFilters: FilterState) => {
    dispatch(setFilters(appliedFilters));
    dispatch(
      fetchOffers({
        searchText: search,
        filters: appliedFilters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handleSortChange = (option: string) => {
    const backendSort = getSortValue(option);
    dispatch(setSortBy(backendSort));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy: backendSort,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handleSearchSubmit = (query: string) => {
    dispatch(setSearch(query));
    dispatch(
      fetchOffers({
        searchText: query,
        filters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        page: newPage,
        limit: registrosPorPagina,
      }),
    );
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // --- Render ---
  return (
    <>
      <Header />

      <h1 className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 px-3">
        Ofertas de Trabajo
      </h1>

      <div
        ref={stickyRef}
        className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-3 shadow-md ${
          isDrawerOpen ? 'z-10' : 'z-50'
        }`}
      >
        <div className="flex flex-row items-center gap-2 mb-3">
          <FilterButton onClick={toggleDrawer} />
          <div className="flex-1">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
        </div>

        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <PaginationSelector
              registrosPorPagina={registrosPorPagina}
              onChange={handleRegistrosPorPaginaChange}
            />
            <SortCard value={sortMapInverse[sortBy]} onSelect={handleSortChange} />
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">{error}</div>
        )}
        {loading && (
          <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
            Cargando ofertas...
          </div>
        )}

        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onFiltersApply={handleFiltersApply}
        />

        {!loading && trabajos.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-4">
            <div className="flex justify-center">
              <PaginationInfo
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
                totalRegistros={totalRegistros}
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto">
          {!loading && trabajos.length > 0 ? (
            <CardJob trabajos={trabajos} />
          ) : !loading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {!loading && trabajos.length > 0 && (
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
  );
}
