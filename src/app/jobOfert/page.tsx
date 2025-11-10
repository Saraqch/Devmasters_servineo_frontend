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
  resetPagination,
  FilterState,
} from './lib/slice';
import { getSortValue, sortMapInverse } from './lib/constants/sortOptions';
import { useSyncUrlParams } from './hooks/useSyncUrlParams';
import useApplyQueryToStore from './hooks/useApplyQueryToStore';
import AppliedFilters from './components_jo/Search/AppliedFilters';
import useAppliedFilters from './hooks/useAppliedFilters';

export default function JobOffersPage() {
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const { showAppliedFilters, appliedParams, handleClearApplied } = useAppliedFilters();
  const isInitialMount = useRef(true);

  // Hook para aplicar parámetros de URL al store (si existen)
  useApplyQueryToStore();

  // Hook para sincronizar estado del store con la URL
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

  // --- Carga inicial SOLO si no hay parámetros en la URL ---
  useEffect(() => {
    if (!isInitialMount.current) return;

    // Si la URL tiene parámetros, useApplyQueryToStore ya manejó la inicialización
    if (typeof window !== 'undefined' && window.location.search && window.location.search !== '') {
      isInitialMount.current = false;
      return;
    }

    // Si no hay parámetros en la URL, hacer fetch por defecto
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
        date: date || undefined,
        rating: rating ?? undefined,
        page: 1,
        limit: valor,
        titleOnly,
        exact,
      }),
    );
  };

  const handleFiltersApply = (appliedFilters: FilterState) => {
    dispatch(setFilters(appliedFilters));
    dispatch(resetPagination());
    dispatch(
      fetchOffers({
        searchText: search,
        filters: appliedFilters,
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: 1,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handleSortChange = (option: string) => {
    const backendSort = getSortValue(option);
    dispatch(setSortBy(backendSort));
    dispatch(resetPagination());
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy: backendSort,
        date: date || undefined,
        rating: rating ?? undefined,
        page: 1,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handleSearchSubmit = (query: string) => {
    dispatch(setSearch(query));
    dispatch(resetPagination());
    dispatch(
      fetchOffers({
        searchText: query,
        filters,
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: 1,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
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
        <div className="flex gap-2">
          <FilterButton onClick={toggleDrawer} />
          <SearchBar onSearch={handleSearchSubmit} />
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
        {showAppliedFilters && appliedParams && (
          <AppliedFilters params={appliedParams} onClear={handleClearApplied} />
        )}

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
