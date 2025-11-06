'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';

// Mapeo de imágenes por categoría (3 imágenes por cada una)
const categoryImages: { [key: string]: string[] } = {
  Albañil: ['/img/albañil1.jpg', '/img/albañil2.jpg', '/img/albañil3.jpg'],
  Carpintero: ['/img/carpintero1.jpg', '/img/carpintero2.jpg', '/img/carpintero3.jpg'],
  Fontanero: ['/img/fontanero1.jpg', '/img/fontanero2.jpg', '/img/fontanero3.jpg'],
  Electricista: ['/img/electricista1.jpg', '/img/electricista2.jpg', '/img/electricista3.jpg'],
  Pintor: ['/img/pintor1.jpg', '/img/pintor2.jpg', '/img/pintor3.jpg'],
  Soldador: ['/img/soldador1.jpg', '/img/soldador2.jpg', '/img/soldador3.jpg'],
  Jardinero: ['/img/jardinero1.jpg', '/img/jardinero2.jpg', '/img/jardinero3.jpg'],
  Cerrajero: ['/img/cerrajero1.jpg', '/img/cerrajero2.jpg', '/img/cerrajero3.jpg'],
  Mecánico: ['/img/mecanico1.jpg', '/img/mecanico2.jpg', '/img/mecanico3.jpg'],
  Vidriero: ['/img/vidriero1.jpg', '/img/vidriero2.jpg', '/img/vidriero3.jpg'],
  Yesero: ['/img/yesero1.jpg', '/img/yesero2.jpg', '/img/yesero3.jpg'],
  Fumigador: ['/img/fumigador1.jpg', '/img/fumigador2.jpg', '/img/fumigador3.jpg'],
  Limpiador: ['/img/limpiador1.jpg', '/img/limpiador2.jpg', '/img/limpiador3.jpg'],
  Instalador: ['/img/instalador1.jpg', '/img/instalador2.jpg', '/img/instalador3.jpg'],
  Montador: ['/img/montador1.jpg', '/img/montador2.jpg', '/img/montador3.jpg'],
  Decorador: ['/img/decorador1.jpg', '/img/decorador2.jpg', '/img/decorador3.jpg'],
  Pulidor: ['/img/pulidor1.jpg', '/img/pulidor2.jpg', '/img/pulidor3.jpg'],
  Techador: ['/img/techador1.jpg', '/img/techador2.jpg', '/img/techador3.jpg'],
  Default: ['/img/default1.jpg', '/img/default2.jpg', '/img/default3.jpg'],
};

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
  rating: number;
  imagenUrl?: string;
}

interface CardJobProps {
  trabajos: OfferData[];
}

const CardJob = ({ trabajos }: CardJobProps) => {
  const handleCardClick = (id: string) => {
    console.log('Card clicked:', id);
  };

  // Función para obtener una imagen basada en el ID (determinística)
  const getImageForJob = useCallback((jobId: string, category: string): string => {
    const images = categoryImages[category] || categoryImages['Default'];
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) {
      hash = jobId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % images.length;
    return images[index];
  }, []);

  // Memorizar las imágenes asignadas para cada trabajo
  const trabajosConImagenes = useMemo(() => {
    return trabajos.map((trabajo) => ({
      ...trabajo,
      imagenAsignada: trabajo.imagenUrl || getImageForJob(trabajo._id, trabajo.category),
    }));
  }, [trabajos, getImageForJob]);

  return (
    <div className="w-full">
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
        Resultados de la búsqueda
      </h1>

      {trabajosConImagenes.length === 0 ? (
        <p className="text-gray-500 text-center">No se encontraron resultados</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trabajosConImagenes.map((t) => (
            <button
              key={t._id}
              onClick={() => handleCardClick(t._id)}
              className="group relative w-full overflow-hidden rounded-xl border border-[#2B6AE0] bg-white transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-48 h-48 sm:h-50 flex-shrink-0 overflow-hidden bg-gray-200">
                <Image
                  src={t.imagenAsignada}
                  alt={`Trabajo de ${t.fixerName}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 12rem"
                  className="object-cover"
                  priority
                />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 border border-gray-200 shadow-sm z-10">
                  <span className="font-medium text-[#2B6AE0]">{t.city}</span>
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between relative">
                <div className="absolute right-3 top-3 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-[#2B6AE0] shadow-lg border border-[#2B6AE0]/20">
                  {t.price} Bs
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2 pr-20">{t.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 text-left">{t.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-3 gap-3">
                  <div className="text-left flex-1 w-full">
                    <div className="text-sm font-medium text-gray-700">{t.fixerName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <strong>Contacto:</strong> {t.contactPhone}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      <strong>Publicado:</strong> {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                    {t.tags && t.tags.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Etiquetas:</strong> {t.tags.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-xs bg-[#2B6AE0] px-3 py-1 rounded-full text-white font-medium whitespace-nowrap">
                      {t.category}
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded-full text-gray-700 border border-yellow-200 whitespace-nowrap">
                      <svg
                        className="w-3 h-3 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span>{t.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardJob;
