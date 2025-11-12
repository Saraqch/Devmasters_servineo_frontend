// src\app\jobOfert\components_jo\CardJob.tsx
'use client';

import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categoryImages } from '../lib/constants/img';

interface OfferData {
  _id: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating?: number;
  fixerPhoto?: string;
  completedJobs?: number;
  imagenUrl?: string;
  photos?: string[];
  fixerId?: string;
}

interface CardJobProps {
  trabajos: OfferData[];
  viewMode?: 'grid' | 'list';
  onCardClick?: (id: string) => void;
}

const CardJob = ({ trabajos, viewMode = 'grid', onCardClick }: CardJobProps) => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    console.log('🎯 Click en card, ID:', id);
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    console.log('📱 Click en WhatsApp:', phone);
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleFixerClick = (e: React.MouseEvent, fixerId?: string, fixerName?: string) => {
    e.stopPropagation();

    console.log('👤 Click en área del fixer');
    console.log('   - fixerId:', fixerId);
    console.log('   - fixerName:', fixerName);

    if (!fixerId) {
      console.warn('⚠️ No hay fixerId disponible, usando ID temporal por defecto');
      // Usar un ID por defecto mientras se implementa la BD completa
      fixerId = 'fixer-001';
    }

    const targetUrl = `/fixer/${fixerId}`;
    console.log('🚀 Navegando a:', targetUrl);

    try {
      router.push(targetUrl);
      console.log('✅ Navegación iniciada');
    } catch (error) {
      console.error('❌ Error al navegar:', error);
    }
  };

  const getImagesForJob = useCallback((jobId: string, category: string): string[] => {
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
  }, []);

  const trabajosConImagenes = useMemo(() => {
    return trabajos.map((trabajo) => {
      let allImages: string[];

      if (trabajo.photos && trabajo.photos.length > 0) {
        allImages = trabajo.photos;
      } else if (trabajo.imagenUrl) {
        allImages = [trabajo.imagenUrl];
      } else {
        allImages = getImagesForJob(trabajo._id, trabajo.category);
      }

      return {
        ...trabajo,
        imagenAsignada: allImages[0],
        allImages: allImages,
      };
    });
  }, [trabajos, getImagesForJob]);

  // Debug: Ver datos de trabajos
  useEffect(() => {
    console.log('📊 Trabajos cargados:', trabajosConImagenes.length);
    console.log(
      '📋 Primeros 3 trabajos:',
      trabajosConImagenes.slice(0, 3).map((t) => ({
        id: t._id,
        title: t.title,
        fixerId: t.fixerId,
        fixerName: t.fixerName,
      })),
    );
  }, [trabajosConImagenes]);

  const GridView = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
    const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

    const handleMouseEnter = (cardId: string) => {
      setHoveredCard(cardId);
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const trabajoConImagenes = trabajosConImagenes.find((t) => t._id === cardId);
          const totalImages = trabajoConImagenes?.allImages?.length || 1;
          return {
            ...prev,
            [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
          };
        });
      }, 2000);
    };

    const handleMouseLeave = (cardId: string) => {
      setHoveredCard(null);
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
        delete intervalRefs.current[cardId];
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: 0,
      }));
    };

    useEffect(() => {
      // Capture the current ref value when effect runs
      const intervals = intervalRefs.current;

      return () => {
        // Use the captured value in cleanup
        Object.values(intervals).forEach(clearInterval);
      };
    }, []);

    const handlePrevImage = (e: React.MouseEvent, cardId: string, totalImages: number) => {
      e.stopPropagation();
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) - 1 + totalImages) % totalImages,
      }));
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
        }));
      }, 2000);
    };

    const handleNextImage = (e: React.MouseEvent, cardId: string, totalImages: number) => {
      e.stopPropagation();
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
      }));
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
        }));
      }, 2000);
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {trabajosConImagenes.map((t) => {
          const currentIndex = currentImageIndex[t._id] || 0;
          const totalImages = t.allImages?.length || 1;

          return (
            <div
              key={t._id}
              onMouseEnter={() => handleMouseEnter(t._id)}
              onMouseLeave={() => handleMouseLeave(t._id)}
              className="group relative w-full overflow-hidden rounded-xl border border-primary border-2 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Área clickeable para abrir modal */}
              <div onClick={() => handleCardClick(t._id)} className="cursor-pointer">
                {/* Imagen con controles */}
                <div className="h-48 w-full relative">
                  {t.allImages?.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={t.title || 'Oferta de trabajo'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className={`object-cover transition-opacity duration-500 ${
                        idx === currentIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ position: 'absolute' }}
                      priority={idx === 0}
                    />
                  ))}

                  {totalImages > 1 && hoveredCard === t._id && (
                    <>
                      <button
                        onClick={(e) => handlePrevImage(e, t._id, totalImages)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-10"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-800" />
                      </button>
                      <button
                        onClick={(e) => handleNextImage(e, t._id, totalImages)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-10"
                        aria-label="Imagen siguiente"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-800" />
                      </button>
                    </>
                  )}

                  {totalImages > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                      {Array.from({ length: totalImages }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 rounded-full transition-all ${
                            idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* City Badge */}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm border border-primary">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium text-gray-700">{t.city}</span>
                </div>

                {/* Price */}
                <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm border border-primary/20">
                  {t.price?.toLocaleString()} Bs
                </div>

                {/* Información de la oferta */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate text-left">
                        {t.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2 text-left">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium text-xs">
                        {t.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Fixer - Clickeable para ir al perfil */}
              <div
                className="pt-3 border-t border-gray-100 flex items-center justify-between hover:bg-gray-50 px-4 pb-4 transition-colors cursor-pointer"
                onClick={(e) => handleFixerClick(e, t.fixerId, t.fixerName)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {t.fixerPhoto ? (
                      <Image
                        src={t.fixerPhoto}
                        alt={t.fixerName || 'Fixer'}
                        className="w-full h-full object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {t.fixerName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate text-left">
                      {t.fixerName || 'Usuario'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {t.rating && (
                        <>
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-1 text-xs font-medium text-gray-600">
                              {t.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="mx-1 text-gray-300">•</span>
                        </>
                      )}
                      <span>{t.completedJobs || 0} trabajos</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleWhatsAppClick(e, t.contactPhone)}
                  className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-full transition-colors shadow-sm flex items-center gap-2 flex-shrink-0"
                  aria-label="Contactar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-medium hidden sm:inline">
                    {t.contactPhone}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ListView = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
    const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

    const handleMouseEnter = (cardId: string) => {
      setHoveredCard(cardId);
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const trabajoConImagenes = trabajosConImagenes.find((t) => t._id === cardId);
          const totalImages = trabajoConImagenes?.allImages?.length || 1;
          return {
            ...prev,
            [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
          };
        });
      }, 2000);
    };

    const handleMouseLeave = (cardId: string) => {
      setHoveredCard(null);
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
        delete intervalRefs.current[cardId];
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: 0,
      }));
    };

    useEffect(() => {
      // Capture the current ref value when effect runs
      const intervals = intervalRefs.current;

      return () => {
        // Use the captured value in cleanup
        Object.values(intervals).forEach(clearInterval);
      };
    }, []);

    const handlePrevImage = (e: React.MouseEvent, cardId: string, totalImages: number) => {
      e.stopPropagation();
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) - 1 + totalImages) % totalImages,
      }));
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
        }));
      }, 2000);
    };

    const handleNextImage = (e: React.MouseEvent, cardId: string, totalImages: number) => {
      e.stopPropagation();
      if (intervalRefs.current[cardId]) {
        clearInterval(intervalRefs.current[cardId]);
      }
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
      }));
      intervalRefs.current[cardId] = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % totalImages,
        }));
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-4">
        {trabajosConImagenes.map((t) => {
          const currentIndex = currentImageIndex[t._id] || 0;
          const totalImages = t.allImages?.length || 1;

          return (
            <div
              key={t._id}
              onMouseEnter={() => handleMouseEnter(t._id)}
              onMouseLeave={() => handleMouseLeave(t._id)}
              className="group relative w-full overflow-hidden rounded-xl border border-primary border-2 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-row"
            >
              {/* Imagen - clickeable para modal */}
              <div
                className="relative w-64 h-48 flex-shrink-0 overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => handleCardClick(t._id)}
              >
                {t.allImages?.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={t.title || 'Oferta de trabajo'}
                    fill
                    sizes="16rem"
                    className={`object-cover transition-opacity duration-500 ${
                      idx === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ position: 'absolute' }}
                    priority={idx === 0}
                  />
                ))}

                {totalImages > 1 && hoveredCard === t._id && (
                  <>
                    <button
                      onClick={(e) => handlePrevImage(e, t._id, totalImages)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-10"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => handleNextImage(e, t._id, totalImages)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-10"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-800" />
                    </button>
                  </>
                )}

                {totalImages > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                    {Array.from({ length: totalImages }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all ${
                          idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm border border-primary">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium text-gray-700">{t.city}</span>
                </div>
              </div>

              {/* Información - clickeable para modal */}
              <div
                className="flex-1 p-4 flex flex-col relative cursor-pointer"
                onClick={() => handleCardClick(t._id)}
              >
                <div className="absolute right-4 top-4 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20">
                  {t.price?.toLocaleString()} Bs
                </div>

                <div className="mb-2 pr-32">
                  <h3 className="text-base font-semibold text-gray-900 text-left">{t.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2 text-left">
                    {t.description}
                  </p>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium text-xs">
                      {t.category}
                    </span>
                    {t.tags && t.tags.length > 0 && (
                      <>
                        {t.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Información del Fixer - Clickeable para ir al perfil */}
                <div
                  className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto hover:bg-gray-50 -mx-4 px-4 -mb-4 pb-4 transition-colors cursor-pointer"
                  onClick={(e) => handleFixerClick(e, t.fixerId, t.fixerName)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {t.fixerPhoto ? (
                        <Image
                          src={t.fixerPhoto}
                          alt={t.fixerName || 'Fixer'}
                          className="w-full h-full object-cover"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                          {t.fixerName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate text-left">
                        {t.fixerName || 'Usuario'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {t.rating && (
                          <>
                            <div className="flex items-center text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="ml-1 text-xs font-medium text-gray-600">
                                {t.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="mx-1 text-gray-300">•</span>
                          </>
                        )}
                        <span>{t.completedJobs || 0} trabajos</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleWhatsAppClick(e, t.contactPhone)}
                    className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-full transition-colors shadow-sm flex items-center gap-2 flex-shrink-0"
                    aria-label="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">{t.contactPhone}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
        Resultados de la búsqueda
      </h1>

      {trabajosConImagenes.length === 0 ? (
        <p className="text-gray-500 text-center">No se encontraron resultados</p>
      ) : (
        <>
          <div className="lg:hidden">
            <GridView />
          </div>
          <div className="hidden lg:block">{viewMode === 'grid' ? <GridView /> : <ListView />}</div>
        </>
      )}
    </div>
  );
};

export default CardJob;
