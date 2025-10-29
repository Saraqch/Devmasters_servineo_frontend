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
import { InputDemo } from '@/app/search/components_se/SearchBar';
import { SearchButton } from '@/app/search/components_se/SearchButton';
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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
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
    setValidationMessage(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 100) {
      dispatch(setSearch(value.slice(0, 100)));
      setValidationMessage('Límite máximo de 100 caracteres');
      return;
    }

    dispatch(setSearch(value));
    if (validationMessage) {
      setValidationMessage(null);
    }
  };

  const validateSearch = (trimmedSearch: string): string | null => {
    if (trimmedSearch.length === 0) {
      return 'Debe ingresar un término de búsqueda válido';
    }

    if (trimmedSearch.length < 2) {
      return 'Introduce al menos dos caracteres para buscar.';
    }

    const allowedRegex =
      /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      return 'Búsqueda invalida por contener caracteres especiales no permitidos. Solo se permiten los carateres especiales "," , "_" , " ." y "-"';
    }

    return null;
  };

  const handleSearch = async () => {
    const trimmedSearch = search.trim();
    const validationError = validateSearch(trimmedSearch);

    if (validationError) {
      setValidationMessage(validationError);
      return;
    }

    setValidationMessage(null);
    dispatch(
      fetchOffers({
        searchText: trimmedSearch,
        filters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handleFiltersApply = async (appliedFilters: FilterState) => {
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

  const handleSortChange = async (option: string) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
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
          <div className="flex-shrink-0">
            <FilterButton onClick={toggleDrawer} />
          </div>

          <div className="flex-1 min-w-0 relative">
            <InputDemo
              value={search}
              onChange={handleInputChange}
              onClear={() => {
                dispatch(setSearch(''));
                resetToInitial();
              }}
              onKeyDown={handleKeyDown}
              hasError={!!validationMessage}
            />
            {validationMessage && (
              <div className="absolute left-0 top-full mt-1 w-full z-50">
                <p className="text-red-500 text-sm sm:text-base">{validationMessage}</p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <SearchButton onClick={handleSearch} disabled={loading} />
          </div>
        </div>

        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <div className="w-full sm:w-auto">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={handleRegistrosPorPaginaChange}
              />
            </div>
            <div className="w-full sm:w-auto">
              <SortCard value={sortMapInverse[sortBy]} onSelect={handleSortChange} />
            </div>
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded text-sm sm:text-base">
            Error: {error}
          </div>
        )}

        {loading && (
          <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded text-sm sm:text-base">
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl font-roboto font-normal">
                No se encontraron resultados
                {search.trim() && (
                  <>
                    {' '}
                    para <span className="font-bold">&quot;{search.trim()}&quot;</span>
                  </>
                )}
              </p>
            </div>
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
