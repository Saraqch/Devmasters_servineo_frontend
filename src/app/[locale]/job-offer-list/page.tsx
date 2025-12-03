'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  SearchBar,
  NoResultsMessage,
  FilterButton,
  FilterDrawer,
  Paginacion,
  PaginationInfo,
  PaginationSelector,
  SortCard,
} from '@/Components/Job-offers';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  setSearch,
  setFilters,
  setSortBy,
  setRegistrosPorPagina,
  resetPagination,
  setRating,
  setPaginaActual,
  resetFilters,
  enablePersistence,
} from '@/app/redux/slice/jobOfert';
import { STORAGE_KEYS } from '@/app/redux/features/jobOffers/storage';
import type { FilterState } from '@/app/redux/features/jobOffers/types';
import { getSortValue } from '../../lib/constants/sortOptions';
import {
  useJobOffers,
  useInitialUrlParams,
  useSyncUrlParams,
} from '@/app/redux/features/jobOffers/jobOffersHooks';
import { JobOfferModal } from '@/Components/Job-offers/Job-offer-modal';
import { JobOffersView, type ViewMode } from '@/Components/Job-offers/JobOffersView';
import { ViewModeToggle } from '@/Components/Job-offers/ViewModeToggle';
import { useTranslations } from 'next-intl';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
import { adaptOfferToModalFormat } from '@/types/jobOffers';

const SCROLL_POSITION_KEY = 'jobOffers_scrollPosition';

export default function JobOffersPage() {
  const t = useTranslations('jobOffers');
  const dispatch = useAppDispatch();

  useInitialUrlParams();

  const { offers, total, isLoading } = useJobOffers();

  const {
    sortBy,
    search,
    paginaActual,
    totalPages,
    registrosPorPagina,
    error: reduxError,
  } = useAppSelector((state) => state.jobOfert);

  useSyncUrlParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const scrollRestoredRef = useRef(false);
  const pageBeforeFilter = useRef<number>(1);
  const hasActiveFilters = useRef<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOffer, setSelectedOffer] = useState<AdaptedJobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // corregir pagina actual si esta fuera del limite
    if (!isLoading && totalPages > 0) {
      const params = new URLSearchParams(window.location.search);
      const pageParam = Number(params.get('page') || 1);

      let correctedPage = pageParam;

      if (pageParam < 1 || isNaN(pageParam)) {
        correctedPage = 1;
      } else if (pageParam > totalPages) {
        correctedPage = totalPages;
      }

      if (correctedPage !== pageParam) {
        params.set('page', correctedPage.toString());
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
        dispatch(setPaginaActual(correctedPage));
      }
    }
  }, [isLoading, totalPages, dispatch]);

  // Limpiar búsqueda si se navega directamente sin parámetros
  // Pero no limpiar si existe un valor guardado en localStorage (persistencia)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (params.toString() === '' && search !== '') {
        let hasSavedSearch = false;
        try {
          hasSavedSearch = !!window.localStorage.getItem(STORAGE_KEYS.SEARCH);
        } catch (e) {
          hasSavedSearch = false;
          console.error('Error accessing localStorage:', e);
        }

        if (!hasSavedSearch) dispatch(setSearch(''));
      }
    }
  }, [dispatch, search]);

  // Guardar posición del scroll
  useEffect(() => {
    const saveScrollPosition = () => {
      try {
        sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
      } catch {
        // ignorar errores
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // Restaurar posición del scroll
  useEffect(() => {
    if (!isLoading && Array.isArray(offers) && offers.length > 0 && !scrollRestoredRef.current) {
      try {
        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          if (!isNaN(position)) {
            setTimeout(() => {
              window.scrollTo(0, position);
              scrollRestoredRef.current = true;
              sessionStorage.removeItem(SCROLL_POSITION_KEY);
            }, 100);
          }
        }
      } catch {
        // ignorar errores
      }
    }
  }, [isLoading, offers]);

  // Sticky header
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

  const handleCardClick = useCallback((offer: JobOfferData) => {
    const adaptedOffer = adaptOfferToModalFormat(offer);
    setSelectedOffer(adaptedOffer);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleRegistrosPorPaginaChange = useCallback(
    (valor: number) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setRegistrosPorPagina(valor));
    },
    [dispatch],
  );

  const handleFiltersApply = useCallback(
    (appliedFilters: FilterState) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const hasFilters =
        appliedFilters.range.length > 0 ||
        (Array.isArray(appliedFilters.city)
          ? appliedFilters.city.length > 0
          : !!appliedFilters.city) ||
        appliedFilters.category.length > 0;

      if (hasFilters && !hasActiveFilters.current) {
        pageBeforeFilter.current = paginaActual;
        hasActiveFilters.current = true;
      }

      if (!hasFilters) {
        hasActiveFilters.current = false;
      }

      dispatch(setFilters(appliedFilters));
      dispatch(resetPagination());
    },
    [dispatch, paginaActual],
  );

  const handleSortChange = useCallback(
    (option: string) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const backendSort = getSortValue(option);
      dispatch(setSortBy(backendSort));
    },
    [dispatch],
  );

  const handleSearchSubmit = useCallback(
    (query: string) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setSearch(query));
      dispatch(resetPagination());
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    const pageToRestore = hasActiveFilters.current ? pageBeforeFilter.current : 1;
    hasActiveFilters.current = false;

    dispatch(resetFilters());

    setTimeout(() => {
      dispatch(enablePersistence());
      dispatch(setPaginaActual(pageToRestore));
    }, 0);
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setPaginaActual(newPage));
    },
    [dispatch],
  );

  const handleRatingChange = useCallback(
    (rating: number | null) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const hasRatingFilter = rating != null;
      if (hasRatingFilter && !hasActiveFilters.current) {
        pageBeforeFilter.current = paginaActual;
        hasActiveFilters.current = true;
      }

      if (!hasRatingFilter) {
        hasActiveFilters.current = false;
      }

      dispatch(setRating(rating));
      dispatch(resetPagination());
    },
    [dispatch, paginaActual],
  );

  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const processedOffers = useMemo(() => {
    return offers;
  }, [offers]);

  return (
    <>
      <h1 className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 px-3">
        {t('pageTitle')}
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

        {!isLoading && Array.isArray(offers) && offers.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center gap-2">
              <div className="w-auto">
                <SortCard value={sortBy} onSelect={handleSortChange} />
              </div>

              {/* Mobile view toggle */}
              <ViewModeToggle
                viewMode={viewMode}
                onChange={handleViewModeChange}
                variant="mobile"
                className="flex lg:hidden"
              />

              {/* Desktop view toggle */}
              <ViewModeToggle
                viewMode={viewMode}
                onChange={handleViewModeChange}
                variant="desktop"
                className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2"
              />

              <div className="hidden lg:block w-auto">
                <PaginationSelector
                  registrosPorPagina={registrosPorPagina}
                  onChange={handleRegistrosPorPaginaChange}
                />
              </div>
            </div>

            <div className="flex justify-center lg:hidden">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={handleRegistrosPorPaginaChange}
              />
            </div>
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {reduxError && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">{reduxError}</div>
        )}

        {isLoading && (
          <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
            {t('loading', { default: 'Cargando ofertas...' })}
          </div>
        )}

        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onFiltersApply={handleFiltersApply}
          onRatingChange={handleRatingChange}
          onReset={handleResetFilters}
        />

        {!isLoading && Array.isArray(offers) && offers.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-4">
            <div className="flex justify-center">
              <PaginationInfo
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
                totalRegistros={total}
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto">
          {!isLoading && Array.isArray(offers) && offers.length > 0 ? (
            <JobOffersView
              offers={processedOffers}
              viewMode={viewMode}
              onOfferClick={handleCardClick}
              search={search}
            />
          ) : !isLoading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {!isLoading && Array.isArray(offers) && offers.length > 0 && viewMode !== 'map' && (
          <div className="mt-8 mb-24 flex justify-center">
            <Paginacion
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={total}
              onChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <JobOfferModal offer={selectedOffer} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
