// src/components/Home/RecentOffer-section.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RecentOfferCard from './RecentOfferCard';
import { categoryImages } from '@/app/jobOfert/lib/constants/img';
import { mockFixers } from '@/app/lib/mock-data';
import { JobOfferModal } from '@/components/Job-offers/Job-offer-modal';
import { api } from '@/lib/api';

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
  category: string;
  price: number;
  createdAt: string | Date;
  city?: string;
  rating?: number;
  completedJobs?: number;
  allImages?: string[];
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
}

interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
  currentPage?: number;
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

export default function RecentOffersSection() {
  // Estados
  const [trabajos, setTrabajos] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [intervals, setIntervals] = useState<Record<string, NodeJS.Timeout>>({});
  const [selectedOffer, setSelectedOffer] = useState<AdaptedOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (offer.allImages && offer.allImages.length > 0) {
      photos = offer.allImages;
    } else if (offer.photos && offer.photos.length > 0) {
      photos = offer.photos;
    } else if (offer.imagenUrl) {
      photos = [offer.imagenUrl];
    } else {
      photos = getImagesForCategory(offer._id, offer.category);
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

  // Fetch offers usando api.get
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);

      try {
        const urlParams = new URLSearchParams({
          sortBy: 'recent',
          page: '1',
          limit: '8',
        });

        const endpoint = `/api/devmaster/offers?${urlParams.toString()}`;
        const response = await api.get<OfferResponse>(endpoint);

        if (response.success && response.data) {
          setTrabajos(response.data.data || []);
          setError(null);
        } else {
          const errorMsg = response.error || 'Error al cargar ofertas';
          setError(errorMsg);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Cleanup intervals
  useEffect(() => {
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [intervals]);

  // Adaptar trabajos con imágenes
  const trabajosConImagenes = trabajos.slice(0, 8).map((trabajo) => {
    const allImages = getImagesForCategory(trabajo._id, trabajo.category);

    return {
      ...trabajo,
      imagenAsignada: allImages[0],
      allImages: allImages,
    };
  });

  // Handlers para navegación de imágenes
  const handleMouseEnter = (cardId: string, totalImages: number) => {
    setHoveredCard(cardId);
    if (totalImages > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
        }));
      }, 2000);

      setIntervals((prev) => ({
        ...prev,
        [cardId]: interval,
      }));
    }
  };

  const handleMouseLeave = (cardId: string) => {
    setHoveredCard(null);

    if (intervals[cardId]) {
      clearInterval(intervals[cardId]);
      setIntervals((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[cardId];
        return newIntervals;
      });
    }

    setCurrentImageIndex((prev) => ({
      ...prev,
      [cardId]: 0,
    }));
  };

  const handlePrevImage = (cardId: string, totalImages: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervals[cardId]) {
      clearInterval(intervals[cardId]);
    }
    setCurrentImageIndex((prev) => ({
      ...prev,
      [cardId]: ((prev[cardId] || 0) - 1 + totalImages) % totalImages,
    }));

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
      }));
    }, 2000);

    setIntervals((prev) => ({
      ...prev,
      [cardId]: interval,
    }));
  };

  const handleNextImage = (cardId: string, totalImages: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervals[cardId]) {
      clearInterval(intervals[cardId]);
    }
    setCurrentImageIndex((prev) => ({
      ...prev,
      [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
    }));

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
      }));
    }, 2000);

    setIntervals((prev) => ({
      ...prev,
      [cardId]: interval,
    }));
  };

  // Handler para abrir modal
  const handleCardClick = (offer: OfferData) => {
    const adaptedOffer = adaptOfferToMockFormat(offer);
    setSelectedOffer(adaptedOffer);
    setIsModalOpen(true);
  };

  const retryFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const urlParams = new URLSearchParams({
        sortBy: 'recent',
        page: '1',
        limit: '8',
      });

      const endpoint = `/api/devmaster/offers?${urlParams.toString()}`;
      const response = await api.get<OfferResponse>(endpoint);

      if (response.success && response.data) {
        setTrabajos(response.data.data || []);
      } else {
        setError(response.error || 'Error al cargar ofertas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Ofertas Recientes</h2>
            <p className="text-gray-600">Descubre las últimas ofertas publicadas</p>
          </div>
          <Link
            href="/jobOfert"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            Ver todas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Cards Grid - 4 columnas */}
        {!loading && !error && trabajosConImagenes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trabajosConImagenes.map((offer) => (
              <RecentOfferCard
                key={offer._id}
                offer={offer}
                onCardClick={handleCardClick}
                hoveredCard={hoveredCard}
                currentImageIndex={currentImageIndex[offer._id] || 0}
                onMouseEnter={() => handleMouseEnter(offer._id, offer.allImages?.length || 1)}
                onMouseLeave={() => handleMouseLeave(offer._id)}
                onPrevImage={handlePrevImage(offer._id, offer.allImages?.length || 1)}
                onNextImage={handleNextImage(offer._id, offer.allImages?.length || 1)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trabajosConImagenes.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas disponibles</h3>
            <p className="text-gray-500">Aún no hay ofertas recientes para mostrar</p>
          </div>
        )}
      </div>

      {/* Modal de detalles de oferta */}
      <JobOfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
