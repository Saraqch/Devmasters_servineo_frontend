'use client';
// aqui falta refacotorizar porque tenemos que traernos con el id todo la data del fixer que esta en la card
import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Star, MessageCircle, Share2, Flag } from 'lucide-react';
import { PillButton } from '@/Components/Pill-button';

import { CertificationsSection } from '@/Components/fixer/dashboard/CertificationsSection';
import { ExperienceSection } from '@/Components/fixer/dashboard/ExperienceSection';
import { PortfolioSection } from '@/Components/fixer/dashboard/PortfolioSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/Tabs/Tabs';
import EstadisticasTrabajos from '@/Components/fixer/Fixer-statistics';
import { JobOfferCard } from '@/Components/Job-offers/JobOfferCard';
import type { JobOfferData } from '@/types/jobOffers';
import { useGetJobOffersByFixerQuery, type JobOffer } from '@/app/redux/services/jobOfferApi';
import { useParams } from 'next/navigation';

// Mock data for the profile header
const MOCK_FIXER = {
  name: 'Juan Perez',
  role: 'Plomero Profesional',
  rating: 4.8,
  reviews: 124,
  location: 'Cochabamba, Bolivia',
  photo: 'https://picsum.photos/80',
  bio: 'Especialista en plomería residencial y comercial con más de 10 años de experiencia. Garantizo trabajos limpios y duraderos.',
  verified: true,
};

export default function FixerProfilePage() {
  const params = useParams<{ locale: string; id: string }>();
  const fixerId = params?.id;
  const [activeTab, setActiveTab] = useState('resumen');
  const { data: fixerOffers, isLoading, isError } = useGetJobOffersByFixerQuery(fixerId as string);

  const mapJobOfferToCardData = (offer: JobOffer): JobOfferData => ({
    _id: offer._id || offer.id || '',
    fixerId: offer.fixerId,
    fixerName: offer.fixerName,
    fixerPhoto: offer.fixerPhoto,
    title: offer.title || 'Servicio',
    description: offer.description,
    category: offer.services?.[0] || 'otros',
    tags: offer.tags || offer.services || [],
    price: offer.price,
    city: offer.city,
    contactPhone: offer.whatsapp,
    createdAt: offer.createdAt || new Date(),
    rating: offer.rating,
    photos: offer.photos,
    allImages: offer.photos,
    imagenUrl: offer.photos && offer.photos.length > 0 ? offer.photos[0] : undefined,
    completedJobs: offer.completedJobs,
    location: offer.location ? [offer.location.address] : undefined,
  });

  const mappedOffers: JobOfferData[] = fixerOffers?.map(mapJobOfferToCardData) || [];
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image
                  src={MOCK_FIXER.photo}
                  alt={MOCK_FIXER.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              {MOCK_FIXER.verified && (
                <div
                  className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full ring-2 ring-white"
                  title="Verificado"
                >
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{MOCK_FIXER.name}</h1>
                  <p className="text-lg text-gray-600 font-medium">{MOCK_FIXER.role}</p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-gray-900">{MOCK_FIXER.rating}</span>
                      <span>({MOCK_FIXER.reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{MOCK_FIXER.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PillButton className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contactar
                  </PillButton>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">{MOCK_FIXER.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl border shadow-sm inline-flex">
            <TabsTrigger value="resumen" className="px-6">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="ofertas" className="px-6">
              Ofertas
            </TabsTrigger>
            <TabsTrigger value="experiencia" className="px-6">
              Experiencia
            </TabsTrigger>
            <TabsTrigger value="certificaciones" className="px-6">
              Certificaciones
            </TabsTrigger>
            <TabsTrigger value="portafolio" className="px-6">
              Portafolio
            </TabsTrigger>
            <TabsTrigger value="estadisticas" className="px-6">
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ofertas Destacadas</h2>
              {isLoading && <p className="text-gray-500 text-sm">Cargando ofertas...</p>}
              {isError && (
                <p className="text-red-500 text-sm">
                  No se pudieron cargar las ofertas de este fixer.
                </p>
              )}
              {!isLoading && !isError && mappedOffers.length === 0 && (
                <p className="text-gray-500 text-sm">Este fixer aún no tiene ofertas publicadas.</p>
              )}
              {!isLoading && !isError && mappedOffers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mappedOffers.map((offer) => (
                    <JobOfferCard key={offer._id} offer={offer} readOnly className="h-full" />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="ofertas">
            {isLoading && <p className="text-gray-500 text-sm">Cargando ofertas...</p>}
            {isError && (
              <p className="text-red-500 text-sm">
                No se pudieron cargar las ofertas de este fixer.
              </p>
            )}
            {!isLoading && !isError && mappedOffers.length === 0 && (
              <p className="text-gray-500 text-sm">Este fixer aún no tiene ofertas publicadas.</p>
            )}
            {!isLoading && !isError && mappedOffers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mappedOffers.map((offer) => (
                  <JobOfferCard key={offer._id} offer={offer} readOnly className="h-full" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiencia">
            <ExperienceSection readOnly />
          </TabsContent>

          <TabsContent value="certificaciones">
            <CertificationsSection readOnly />
          </TabsContent>

          <TabsContent value="portafolio">
            <PortfolioSection readOnly />
          </TabsContent>
          <TabsContent value="estadisticas">
            <EstadisticasTrabajos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
