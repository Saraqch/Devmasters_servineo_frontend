"use client"

import { useRouter } from 'next/navigation'
import { MapPin, Star, MessageCircle } from "lucide-react"
import type { JobOffer } from "@/app/lib/mock-data"
import { ImageCarousel } from "@/Components/Shared/ImageCarousel"
import Image from "next/image"

interface JobOfferCardProps {
  offer: JobOffer
  showFixerInfo?: boolean
  onClick?: () => void
}

export function JobOfferCard({ 
  offer, 
  showFixerInfo = true,
  onClick
}: JobOfferCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/fixer/${offer.fixerId}`)
    }
  }

  const handleFixerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/fixer/${offer.fixerId}`)
  }

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`https://wa.me/${offer.whatsapp}`, '_blank')
  }

  const images = offer.photos?.length > 0 
    ? offer.photos 
    : ["/placeholder.svg?height=180&width=320&text=Oferta"]

  return (
    <div 
      onClick={handleCardClick}
      className="group relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="h-48 w-full relative">
        <ImageCarousel 
          images={images} 
          alt={offer.title || 'Oferta de trabajo'}
        />
        
        {/* WhatsApp Button */}
        {offer.whatsapp && (
          <button
            onClick={handleWhatsAppClick}
            className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* City Badge */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm border border-gray-200">
        <MapPin className="w-3 h-3 text-primary" />
        <span className="font-medium text-gray-700">{offer.city}</span>
      </div>

      {/* Price */}
      <div className="absolute right-3 top-3 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm border border-primary/20">
        {offer.price?.toLocaleString()} Bs
      </div>

      {/* Offer Information */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {offer.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Fixer Information (only if showFixerInfo is true) */}
        {showFixerInfo && (
          <div 
            className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3 hover:bg-gray-50 -mx-4 px-4 pb-1 -mb-1 transition-colors"
            onClick={handleFixerClick}
          >
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {offer.fixerName || 'Usuario'}
              </p>
              <div className="flex items-center">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-xs font-medium text-gray-600">
                    {offer.rating ? `${offer.rating.toFixed(1)}` : 'Nuevo'}
                  </span>
                </div>
                <span className="mx-1 text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {offer.completedJobs || 0} trabajos
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}