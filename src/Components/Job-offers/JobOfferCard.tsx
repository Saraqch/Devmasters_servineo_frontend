// src/Components/Job-offers/JobOfferCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useImageCarousel } from '@/app/redux/features/jobOffers/useImageCarousel';
import type { JobOfferData } from '@/types/jobOffers';
import { SearchHighlight } from '../SearchHighlight';

interface JobOfferCardProps {
  offer: JobOfferData;
  viewMode?: 'grid' | 'list';
  onClick?: (offer: JobOfferData) => void;
  onEdit?: (offer: JobOfferData) => void;
  onDelete?: (id: string) => void;
  className?: string;
  searchQuery?: string;
  readOnly?: boolean;
}

export const JobOfferCard: React.FC<JobOfferCardProps> = ({
  offer,
  viewMode = 'grid',
  onClick,
  onEdit,
  onDelete,
  className = '',
  searchQuery = '',
  readOnly = false,
}) => {
  const router = useRouter();
  const t = useTranslations('cardJob');
  const tCat = useTranslations('Categories');

  // Preparar imágenes
  const images = React.useMemo(() => {
    const imageArray = [];
    
    if (offer.allImages && offer.allImages.length > 0) {
      imageArray.push(...offer.allImages);
    } else if (offer.photos && offer.photos.length > 0) {
      imageArray.push(...offer.photos);
    } else if (offer.imagenUrl) {
      imageArray.push(offer.imagenUrl);
    }
    
    // Filtrar y validar imágenes
    return imageArray.filter((img) => {
      if (!img || typeof img !== 'string') return false;
      
      const trimmed = img.trim();
      if (trimmed.length === 0) return false;
      
      // Validar que sea una URL válida
      try {
        new URL(trimmed);
        return true;
      } catch {
        // Si no es URL válida pero es una ruta relativa, permitir
        return trimmed.startsWith('/') || trimmed.startsWith('./');
      }
    });
  }, [offer]);

  const {
    currentIndex,
    isHovered,
    isTouching,
    elementRef,
    handleMouseEnter,
    handleMouseLeave,
    handlePrevImage,
    handleNextImage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useImageCarousel(offer._id, images.length);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = offer.contactPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleFixerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (offer.fixerId) {
      router.push(`/fixer/${offer.fixerId}`);
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(offer);
  };

  const isDashboardMode = !!onEdit || !!onDelete;
  const totalImages = images.length;

  // Render Image Carousel
  const renderImageCarousel = () => (
    <div
      className={`relative overflow-hidden transition-transform ${isTouching ? 'scale-[0.98]' : 'scale-100'} ${viewMode === 'grid' ? 'h-48 w-full' : 'w-64 self-stretch flex-shrink-0'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
      {images.length > 0 ? (
        images.map((img, idx) => {
          // Double-check en tiempo de render
          if (!img || typeof img !== 'string') return null;
          
          return (
            <Image
              key={idx}
              src={img}
              alt={offer.title}
              fill
              sizes={
                viewMode === 'grid'
                  ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  : '16rem'
              }
              className={`object-cover transition-all duration-500 ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              style={{ position: 'absolute' }}
              priority={idx === 0}
              onError={(e) => {
                console.warn(`Failed to load image: ${img}`, e);
              }}
            />
          );
        })
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm">No image</span>
        </div>
      )}

      {/* Navigation Arrows */}
      {totalImages > 1 && isHovered && (
        <>
          <button
            onClick={handlePrevImage}
            onTouchEnd={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          <button
            onClick={handleNextImage}
            onTouchEnd={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Indicators */}
      {totalImages > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {Array.from({ length: totalImages }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white shadow-lg' : 'w-1.5 bg-white/60'}`}
            />
          ))}
        </div>
      )}

      {/* City Badge */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm border border-primary">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span className="text-gray-700">{offer.city}</span>
      </div>

      {/* Price Badge */}
      {viewMode === 'grid' && (
        <div className="absolute right-3 top-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-sm border border-primary/20">
          <span className="text-primary">{offer.price?.toLocaleString()} Bs</span>
        </div>
      )}
    </div>
  );

  // Render Content
  const renderContent = () => (
    <div
      className={`flex flex-col ${viewMode === 'grid' ? 'p-4' : 'flex-1 pt-4 pb-1 pl-4 pr-4 '}`}
    >
      {/* Price - Solo en List View */}
      {viewMode === 'list' && (
        <div className="absolute right-4 top-4 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-sm border border-primary/20">
          <span className="text-primary">{offer.price?.toLocaleString()} Bs</span>
        </div>
      )}

      {/* Título y Descripción */}
      <div className={viewMode === 'list' ? 'mb-2 pr-32' : ''}>
        <h3
          className={`text-base font-semibold text-gray-900 group-hover:text-primary transition-colors ${viewMode === 'grid' ? 'truncate' : 'text-left'}`}
        >
          <SearchHighlight text={offer.title} searchQuery={searchQuery} />
        </h3>
        <p
          className={`mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed ${viewMode === 'list' ? 'text-left' : ''}`}
        >
          <SearchHighlight text={offer.description} searchQuery={searchQuery} />
        </p>
      </div>

      {/* Tags y Fecha */}
      <div className={viewMode === 'list' ? 'mb-2' : 'mt-2'}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {offer.category ? tCat(offer.category) : ''}
          </span>
          {offer.tags && offer.tags.length > 0 && (
            <>
              {viewMode === 'list' ? (
                offer.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {offer.tags[0]}
                </span>
              )}
            </>
          )}
          <span
            className={`text-xs text-gray-400 font-medium ${viewMode === 'list' ? 'ml-auto' : ''}`}
          >
            {new Date(offer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Footer en List View */}
      {viewMode === 'list' && renderFooter()}
    </div>
  );

  // Render Footer (Fixer Info or Actions)
  const renderFooter = () => {
    if (isDashboardMode && !readOnly) {
      return (
        <div className="border-t border-gray-100 p-3 flex items-center justify-end gap-2 bg-gray-50/50">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(offer);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(offer._id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    if (readOnly) return null;

    return (
      <div
        className={`${viewMode === 'grid' ? 'border-t border-gray-100 p-3' : 'border-t border-gray-100 pl-3 py-2'} flex items-center justify-between gap-3 ${viewMode === 'list' ? 'hover:bg-gray-50 transition-colors' : ''}`}
      >
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleFixerClick}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
            {offer.fixerPhoto ? (
              <Image
                src={offer.fixerPhoto}
                alt={offer.fixerName}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                {offer.fixerName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium text-gray-900 truncate ${viewMode === 'list' ? 'text-left' : ''}`}
            >
              {offer.fixerName || t('defaultUserName')}
            </p>
            {offer.rating && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-600">
                  {offer.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleWhatsAppClick}
          className="flex-shrink-0 bg-[#1AA7ED] hover:bg-[#1AA7ED]/90 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-110 flex items-center gap-2 px-3 py-2"
          aria-label={t('contactWhatsApp')}
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-medium">{offer.contactPhone}</span>
        </button>
      </div>
    );
  };

  return (
  <div
    ref={elementRef}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    className={`group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 ${
      viewMode === 'list' ? 'flex flex-row items-stretch min-h-0' : ''
    } ${className}`}
  >
    <div onClick={handleCardClick} className="cursor-pointer contents">
      {renderImageCarousel()}
      {renderContent()}
    </div>
    {viewMode === 'grid' && renderFooter()}
  </div>
);
};
