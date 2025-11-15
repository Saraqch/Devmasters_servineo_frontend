// src/components/Home/RecentOfferCard.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
// viejo
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
  allImages?: string[];
  imagenAsignada?: string;
}

interface RecentOfferCardProps {
  offer: OfferData;
  onCardClick?: (id: string) => void;
}

export default function RecentOfferCard({ offer, onCardClick }: RecentOfferCardProps) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = offer.allImages?.length || 1;

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(offer._id);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = offer.contactPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleFixerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fixerId = offer.fixerId || 'fixer-001';
    router.push(`/fixer/${fixerId}`);
  };

  const handleMouseEnter = () => {
    setHoveredCard(true);
    if (totalImages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCard(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImageIndex(0);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 2000);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full overflow-hidden rounded-xl border-2 border-primary bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Área clickeable para abrir modal */}
      <div onClick={handleCardClick}>
        {/* Imagen con controles */}
        <div className="h-48 w-full relative overflow-hidden">
          {offer.allImages?.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={offer.title || 'Oferta de trabajo'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ position: 'absolute' }}
              priority={idx === 0}
            />
          ))}

          {totalImages > 1 && hoveredCard && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
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
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* City Badge */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm border border-primary">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="font-medium text-gray-700">{offer.city}</span>
        </div>

        {/* Price */}
        <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm border border-primary/20">
          {offer.price?.toLocaleString()} Bs
        </div>

        {/* Información de la oferta */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate text-left">
                {offer.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2 text-left">
                {offer.description}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium text-xs">
                {offer.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(offer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Fixer - Clickeable para ir al perfil */}
      <div
        className="pt-3 border-t border-gray-100 flex items-center justify-between hover:bg-gray-50 px-4 pb-4 transition-colors cursor-pointer"
        onClick={handleFixerClick}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {offer.fixerPhoto ? (
              <Image
                src={offer.fixerPhoto}
                alt={offer.fixerName || 'Fixer'}
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                {offer.fixerName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate text-left">
              {offer.fixerName || 'Usuario'}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {offer.rating && (
                <>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 text-xs font-medium text-gray-600">
                      {offer.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="mx-1 text-gray-300">•</span>
                </>
              )}
              <span>{offer.completedJobs || 0} trabajos</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleWhatsAppClick}
          className="bg-[#1AA7ED] hover:bg-[#1AA7ED] p-2 rounded-full transition-colors shadow-sm flex items-center gap-2 flex-shrink-0"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
