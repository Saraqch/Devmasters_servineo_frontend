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

const SCROLL_POSITION_KEY = 'jobOffers_scrollPosition';

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
  const isInitialMount = useRef(true);
  const scrollRestoredRef = useRef(false);
  //  Guardar la página antes de aplicar filtros//
  const pageBeforeFilter = useRef<number>(1);
  const hasActiveFilters = useRef<boolean>(false);

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

  // --- Guardar posición del scroll antes de recargar ---
  useEffect(() => {
    const saveScrollPosition = () => {
      try {
        sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
      } catch (e) {
        // ignorar errores de sessionStorage
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // --- Restaurar posición del scroll después de cargar los datos ---
  useEffect(() => {
    if (!loading && trabajos.length > 0 && !scrollRestoredRef.current) {
      try {
        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          if (!isNaN(position)) {
            // Usar setTimeout para asegurar que el DOM esté completamente renderizado
            setTimeout(() => {
              window.scrollTo(0, position);
              scrollRestoredRef.current = true;
              // Limpiar la posición guardada después de restaurarla
              sessionStorage.removeItem(SCROLL_POSITION_KEY);
            }, 100);
          }
        }
      } catch (e) {
        // ignorar errores de sessionStorage
      }
    }
  }, [loading, trabajos]);

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
    scrollRestoredRef.current = true; // Evitar restaurar scroll en cambios de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver arriba al cambiar registros por página
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
    scrollRestoredRef.current = true; // Evitar restaurar scroll en cambios de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver arriba al aplicar filtros
    //  Verificar si realmente hay filtros activos//
    const hasFilters = 
      appliedFilters.range.length > 0 || 
      appliedFilters.city !== '' || 
      appliedFilters.category.length > 0;
    
    //  Solo guardar página si se están aplicando filtros nuevos//
    if (hasFilters && !hasActiveFilters.current) {
      pageBeforeFilter.current = paginaActual;
      hasActiveFilters.current = true;
    }
    
    //  Si se quitaron todos los filtros, marcar como inactivo//
    if (!hasFilters) {
      hasActiveFilters.current = false;
    }


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
    scrollRestoredRef.current = true; // Evitar restaurar scroll en cambios de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver arriba al cambiar orden
    const backendSort = getSortValue(option);
    dispatch(setSortBy(backendSort));
    
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy: backendSort,
        date: date || undefined,
        rating: rating ?? undefined,
        page: paginaActual,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handleSearchSubmit = (query: string) => {
    scrollRestoredRef.current = true; // Evitar restaurar scroll en cambios de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver arriba al buscar
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

  //  Nueva función para resetear filtros y restaurar página//
  const handleResetFilters = () => {
    const pageToRestore = hasActiveFilters.current ? pageBeforeFilter.current : 1;
    hasActiveFilters.current = false;
    
    dispatch(setFilters({ range: [], city: '', category: [] }));
    
    dispatch(
      fetchOffers({
        searchText: search,
        filters: { range: [], city: '', category: [] },
        sortBy,
        date: date || undefined,
        rating: rating ?? undefined,
        page: pageToRestore,// se restaura la pagina guardada
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
    scrollRestoredRef.current = true; // Evitar restaurar scroll en cambios de usuario
    // NO volver arriba al cambiar de página - mantener posición para facilitar navegación
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
          onReset={handleResetFilters} // Nueva prop que restaura la página//
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
