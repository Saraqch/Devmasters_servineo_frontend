'use client';
import React, { Suspense, useState } from 'react';
import Header from './components_RAS/Header';
import Footer from './components_RAS/Footer';
import AppliedFilters from './components_RAS/AppliedFilters';
import useAppliedFilters from '../jobOfert/hooks/useAppliedFilters';
import { Map, List, LayoutGrid } from 'lucide-react';
import { JobOfferModal } from '@/components/Job-offers/Job-offer-modal';
import { MapView } from '@/components/Job-offers/maps/MapView';
import { categoryImages } from '../jobOfert/lib/constants/img';
import { mockFixers } from '@/app/lib/mock-data';

// Reutilizamos las cards y componentes de paginación desde jobOfert
import { CardJob, Paginacion, PaginationInfo, PaginationSelector } from '../jobOfert/components_jo';

// Store hooks y acciones
import { useAppDispatch, useAppSelector } from '../jobOfert/hooks/hook';
import { fetchOffers, setRegistrosPorPagina, setPaginaActual } from '../jobOfert/lib/slice';
import { useInitialUrlParams } from '../jobOfert/hooks/useInitialUrlParams';
import { useSyncUrlParams } from '../jobOfert/hooks/useSyncUrlParams';

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

export default function ResultsAdvSearchPage() {
  const dispatch = useAppDispatch();
  const { appliedParams } = useAppliedFilters();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('list');

  // Estados para el modal
  const [selectedOffer, setSelectedOffer] = useState<AdaptedOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const fixerIdToUse = offer.fixerId || offer.userId || 'fixer-001';
    const fixer =
      mockFixers.find((f) => f.id === fixerIdToUse) || mockFixers.find((f) => f.id === 'fixer-001');

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

  const handlePageChange = (newPage: number) => {
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

  // Handler para abrir modal al hacer click en una card
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

          {/* Filtros aplicados */}
          <AppliedFilters params={appliedParams ?? {}} />

          {/* Contenedor con Selector de registros y botones de vista */}
          {!loading && trabajos && trabajos.length > 0 && (
            <div className="w-full max-w-5xl mx-auto mt-4 px-4 mb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Selector de registros por página */}
                <div className="w-full sm:w-auto">
                  <PaginationSelector
                    registrosPorPagina={registrosPorPagina}
                    onChange={handleRegistrosChange}
                  />
                </div>

                {/* Botones de vista */}
                <div className="flex gap-2">
                  {/* Versión móvil - Solo iconos */}
                  <div className="flex sm:hidden gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
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
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Vista lista"
                    >
                      <List className="w-5 h-5" />
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

                  {/* Versión desktop - Con texto */}
                  <div className="hidden sm:flex gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
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
                </div>
              </div>
            </div>
          )}

          {/* PaginationInfo */}
          <div className="flex justify-center my-4">
            <PaginationInfo
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
            />
          </div>

          {/* Cards de resultados */}
          <div className="w-full max-w-5xl mx-auto">
            {!loading && trabajos && trabajos.length > 0 ? (
              <>
                {viewMode === 'map' ? (
                  <div className="h-[calc(100vh-350px)] rounded-lg overflow-hidden border border-gray-200 bg-white mb-8">
                    <MapView
                      offers={trabajos
                        .map(adaptOfferToMockFormat)
                        .filter((o): o is AdaptedOffer => o !== null)}
                      onOfferClick={(offer) => {
                        const originalOffer = trabajos.find((t: OfferData) => t._id === offer.id);
                        if (originalOffer) {
                          handleOfferClick(originalOffer);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <CardJob trabajos={trabajos} viewMode={viewMode} onCardClick={handleCardClick} />
                )}
              </>
            ) : !loading ? (
              <div className="text-gray-500 text-center">No se encontraron resultados</div>
            ) : (
              <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
                Cargando resultados...
              </div>
            )}
          </div>

          {/* Paginación inferior - Solo mostrar si no está en vista mapa */}
          {!loading && trabajos && trabajos.length > 0 && viewMode !== 'map' && (
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
    </Suspense>
  );
}
