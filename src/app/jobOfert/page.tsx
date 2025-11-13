// src/app/jobOfert/page.tsx
'use client';

 export const dynamic = 'force-dynamic';

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
import { JobOfferModal } from '@/components/Job-offers/Job-offer-modal';
import { MapView } from '@/components/Job-offers/maps/MapView';
import { Map, List, LayoutGrid } from 'lucide-react';
import { categoryImages } from './lib/constants/img';
import { mockFixers } from '@/app/lib/mock-data';

const SCROLL_POSITION_KEY = 'jobOffers_scrollPosition';

// Type for the offer data from the backend
interface OfferData {
  _id: string;
  id?: string;
  fixerId?: string;
  userId?: string;
  fixerName?: string;
  fixerPhoto?: string;
  title: string;
  description: string;
  tags?: string[];
  contactPhone?: string;
  photos?: string[];
  imagenUrl?: string;
  category?: string;
  price: number;
  createdAt: string | Date;
  city?: string;
  rating?: number;
  completedJobs?: number;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
}

// Type for the adapted offer format
interface AdaptedOffer {
  id: string;
  fixerId: string;
  fixerName: string;
  fixerPhoto?: string;
  title: string;
  description: string;
  tags: string[];
  whatsapp: string;
  photos: string[];
  services: string[];
  price: number;
  createdAt: Date;
  city: string;
  rating?: number;
  completedJobs: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

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
  const pageBeforeFilter = useRef<number>(1);
  const hasActiveFilters = useRef<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('list');

  // Estados para el modal
  const [selectedOffer, setSelectedOffer] = useState<AdaptedOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useApplyQueryToStore();

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

  // Función para obtener imágenes de categoría
  const getImagesForCategory = (jobId: string, category: string): string[] => {
    const images = categoryImages[category] || categoryImages['Default'];
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) {
      hash = jobId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const numImages = (Math.abs(hash) % 3) + 1;
    const startIndex = Math.abs(hash) % images.length;
    const selectedImages: string[] = [];
    for (let i = 0; i < numImages; i++) {
      const index = (startIndex + i) % images.length;
      selectedImages.push(images[index]);
    }
    return selectedImages;
  };

  // Función para adaptar datos de BD a formato mock
  const adaptOfferToMockFormat = (offer: OfferData): AdaptedOffer | null => {
    if (!offer) return null;

    // Intentar obtener fixerId de la oferta, o usar uno por defecto
    const fixerIdToUse = offer.fixerId || offer.userId || 'fixer-001';

    // Buscar fixer en mockFixers
    const fixer =
      mockFixers.find((f) => f.id === fixerIdToUse) || mockFixers.find((f) => f.id === 'fixer-001');

    // Obtener imágenes
    let photos: string[] = [];
    if (offer.photos && offer.photos.length > 0) {
      photos = offer.photos;
    } else if (offer.imagenUrl) {
      photos = [offer.imagenUrl];
    } else {
      photos = getImagesForCategory(offer._id, offer.category || 'Default');
    }

    return {
      id: offer._id || offer.id || '',
      fixerId: fixerIdToUse,
      fixerName: fixer?.name || offer.fixerName || 'Usuario',
      fixerPhoto: fixer?.photo || offer.fixerPhoto,
      title: offer.title,
      description: offer.description,
      tags: offer.tags || [],
      whatsapp: offer.contactPhone?.replace(/\D/g, '') || fixer?.whatsapp || '59170000000',
      photos,
      services: offer.category ? [offer.category] : fixer?.services || [],
      price: offer.price,
      createdAt: new Date(offer.createdAt || Date.now()),
      city: offer.city || fixer?.city || 'Cochabamba',
      rating: fixer?.rating || offer.rating,
      completedJobs: fixer?.completedJobs || offer.completedJobs || 0,
      location: {
        lat: offer.location?.lat || -17.3935,
        lng: offer.location?.lng || -66.1468,
        address: offer.location?.address || fixer?.city || `${offer.city || 'Cochabamba'}, Bolivia`,
      },
    };
  };

  // Limpiar búsqueda si se navega directamente sin parámetros
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      // Si la URL no tiene parámetros Y hay búsqueda guardada, limpiarla
      if (params.toString() === '' && search !== '') {
        console.log('Navegación directa detectada, limpiando búsqueda guardada');
        dispatch(setSearch(''));
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
    if (!loading && trabajos.length > 0 && !scrollRestoredRef.current) {
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
  }, [loading, trabajos]);

  // Carga inicial
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

  // Handlers
  const handleRegistrosPorPaginaChange = (valor: number) => {
    scrollRestoredRef.current = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    scrollRestoredRef.current = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const hasFilters =
      appliedFilters.range.length > 0 ||
      appliedFilters.city !== '' ||
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
    scrollRestoredRef.current = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    scrollRestoredRef.current = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        page: pageToRestore,
        limit: registrosPorPagina,
        titleOnly,
        exact,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
    scrollRestoredRef.current = true;
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

  // Handler para abrir modal al hacer click en el área de la oferta
  const handleCardClick = (id: string) => {
    const offer = trabajos.find((t: OfferData) => t._id === id);
    if (offer) {
      const adaptedOffer = adaptOfferToMockFormat(offer);
      setSelectedOffer(adaptedOffer);
      setIsModalOpen(true);
    }
  };

  // Handler para click en oferta desde el mapa
  const handleOfferClick = (offer: OfferData) => {
    const adaptedOffer = adaptOfferToMockFormat(offer);
    setSelectedOffer(adaptedOffer);
    setIsModalOpen(true);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

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

        {!loading && Array.isArray(trabajos) && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {/* Fila superior: Sort y View Mode icons */}
            <div className="flex justify-between items-center gap-2">
              {/* Sort a la izquierda */}
              <div className="w-auto">
                <SortCard value={sortMapInverse[sortBy]} onSelect={handleSortChange} />
              </div>

              {/* Botones de vista - Solo Cuadrícula y Mapa en móvil */}
              <div className="flex lg:hidden gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Vista cuadrícula"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'map'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Vista mapa"
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>

              {/* Botones de vista - Desktop centrados */}
              <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  title="Vista cuadrícula"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-sm">Cuadrícula</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  title="Vista lista"
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm">Lista</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'map'
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  title="Vista mapa"
                >
                  <Map className="w-4 h-4" />
                  <span className="text-sm">Mapa</span>
                </button>
              </div>

              {/* Selector de registros por página a la derecha en Desktop */}
              <div className="hidden lg:block w-auto">
                <PaginationSelector
                  registrosPorPagina={registrosPorPagina}
                  onChange={handleRegistrosPorPaginaChange}
                />
              </div>
            </div>

            {/* Fila inferior: Selector de registros por página centrado solo en móvil */}
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
          onReset={handleResetFilters}
        />

        {!loading && Array.isArray(trabajos) && trabajos.length > 0 && (
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
          {!loading && Array.isArray(trabajos) && trabajos.length > 0 ? (
            <>
              {viewMode === 'map' ? (
                <div className="h-[calc(100vh-250px)] rounded-lg overflow-hidden border border-gray-200 bg-white mb-8">
                  <MapView
                    offers={trabajos
                      .map(adaptOfferToMockFormat)
                      .filter((o): o is AdaptedOffer => o !== null)}
                    onOfferClick={(offer) => {
                      // Find the original OfferData from trabajos
                      const originalOffer = trabajos.find((t: OfferData) => t._id === offer.id);
                      if (originalOffer) {
                        handleOfferClick(originalOffer);
                      }
                    }}
                  />
                </div>
              ) : (
                <CardJob
                  trabajos={trabajos}
                  viewMode={viewMode === 'grid' ? 'grid' : 'list'}
                  onCardClick={handleCardClick}
                />
              )}
            </>
          ) : !loading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {!loading && Array.isArray(trabajos) && trabajos.length > 0 && viewMode !== 'map' && (
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

      {/* Modal de detalles de oferta */}
      <JobOfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </>
  );
}
