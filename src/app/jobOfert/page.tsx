'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/hook';
import { useRouter } from 'next/navigation';
import {
  fetchOffers,
  setSearch,
  setFilters,
  setSortBy,
  setRegistrosPorPagina,
  resetFilters,
  FilterState,
} from './lib/jobOfert.api';
import { SearchBar } from '@/app/jobOfert/components_jo/Search/SearchBar';
import { NoResultsMessage } from './components_jo/Search/NoResultsMessage';
import { FilterButton } from '@/app/jobOfert/components_jo/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components_jo/FilterDrawer';
import Paginacion from './components_jo/Paginacion';
import PaginationInfo from './components_jo/PaginationInfo';
import PaginationSelector from './components_jo/PaginationSelector';
import CardJob from './components_jo/CardJob';
import SortCard from '@/components/sort/SortCard';
import Header from './components_jo/Header';
import Footer from './components_jo/Footer';

export default function JobOffers() {
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
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filters.city) params.set('city', filters.city);
    if (filters.category?.length) params.set('category', filters.category.join(','));
    if (sortBy) params.set('sort', sortBy);
    if (paginaActual) params.set('page', String(paginaActual));
    if (registrosPorPagina) params.set('limit', String(registrosPorPagina));

    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : '', { scroll: false });
  }, [search, filters, sortBy, paginaActual, registrosPorPagina, router]);

  // Carga inicial solo una vez
  useEffect(() => {
    if (isInitialMount.current) {
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
    }
  }, [dispatch]);

  // Sticky header setup
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

  const resetToInitial = () => {
    dispatch(resetFilters());
    dispatch(
      fetchOffers({
        searchText: '',
        filters: { range: [], city: '', category: [] },
        sortBy: 'recent',
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

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

    //const handleSearch = async () => {
  const handleSearch = () => {
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };
  //  const handleFiltersApply = async (appliedFilters: FilterState) => {
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

  const sortMap: Record<string, string> = {
    Destacados: 'rating',
    'Los más recientes': 'recent',
    'Los más antiguos': 'oldest',
    'Nombre A-Z': 'name_asc',
    'Nombre Z-A': 'name_desc',
    'Num de contacto asc': 'contact_asc',
    'Num de contacto desc': 'contact_desc',
  };

  const sortMapInverse: Record<string, string> = Object.fromEntries(
    Object.entries(sortMap).map(([key, value]) => [value, key]),
  );

  //  const handleSortChange = async (option: string) => {
  const handleSortChange = (option: string) => {
    const backendSort = sortMap[option] || 'recent';
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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

  return (
    <>
      <Header />

      <h1 className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 sm:mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-12 lg:px-24">
        Ofertas de Trabajo
      </h1>

      <div
        ref={stickyRef}
        className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-2 sm:py-3 md:py-4 shadow-md mb-1 sm:mb-2 ${
          isDrawerOpen ? 'z-10' : 'z-50'
        }`}
      >
        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <FilterButton onClick={toggleDrawer} />
          <div className="flex-1 min-w-0">
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
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-3 sm:mb-4">
            <div className="flex justify-center">
              <PaginationInfo
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
                totalRegistros={totalRegistros}
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
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
