"use client"

import { JobOfferCard } from "@/Components/Job-offers/Job-offer-card"
import {
  MapPin,
  Star,
  Briefcase,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Calendar,
  Award,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Fixer } from "@/app/lib/mock-data"
import Image from "next/image"

interface FixerProfileContentProps {
  fixer: Fixer
}

export function FixerProfileContent({ fixer }: FixerProfileContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("inicio")

  const getTimeSinceRegistration = (joinDate: Date) => {
    const diff = new Date().getTime() - new Date(joinDate).getTime()
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    if (years > 0) return `Se unió en ${new Date(joinDate).getFullYear()}`
    return `Se unió hace ${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} meses`
  }

  const handleOfferClick = (offerId: string) => {
    router.push(`/offers/${offerId}`)
  }

  const handleContact = () => {
    window.open(`https://wa.me/${fixer.whatsapp}`, "_blank")
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "servicios":
        return renderServicesTab()
      case "reseñas":
        return renderReviewsTab()
      case "fotos":
        return renderPhotosTab()
      default:
        return renderHomeTab()
    }
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Acerca de</h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {fixer.bio || "Este profesional aún no ha agregado una descripción."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Experiencia</p>
              <p className="text-gray-600">{getTimeSinceRegistration(fixer.joinDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Verificación</p>
              <p className="text-gray-600">Identidad confirmada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Payment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Servicios</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {fixer.services.map((service, index) => (
              <span
                key={index}
                className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-xl text-sm font-semibold border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
          </div>
          <div className="space-y-4">
            {fixer.paymentMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-gray-900">{method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      {fixer.jobOffers && fixer.jobOffers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Trabajos Recientes</h2>
            </div>
            <button
              className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-2"
              onClick={() => setActiveTab("servicios")}
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fixer.jobOffers.slice(0, 4).map((offer) => (
              <JobOfferCard key={offer.id} offer={offer} onClick={() => handleOfferClick(offer.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderServicesTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-primary rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Mis Servicios</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fixer.services.map((service, index) => (
          <div
            key={index}
            className="group border-2 border-gray-100 rounded-2xl p-6 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service}</h3>
            <p className="text-gray-600 leading-relaxed">
              Servicio profesional especializado en {service.toLowerCase()} con los más altos estándares de calidad.
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderReviewsTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="ml-1 text-lg font-bold text-amber-700">{fixer.rating?.toFixed(1) || "Nuevo"}</span>
              </div>
              <span className="mx-3 text-gray-300">•</span>
              <span className="text-gray-600">{fixer.completedJobs} trabajos realizados</span>
            </div>
          </div>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
          Escribir reseña
        </button>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 mr-4 flex items-center justify-center">
                  <span className="font-bold text-gray-600">C{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cliente Satisfecho {i + 1}</h4>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Hace {i + 1} semana{i !== 0 ? "s" : ""}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              &quot;Excelente servicio, muy profesional y puntual. El trabajo quedó impecable y el trato fue excelente.
              ¡Totalmente recomendado!&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPhotosTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-primary rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Galería de Trabajos</h2>
      </div>
      {fixer.jobOffers && fixer.jobOffers.some((offer) => offer.photos?.length > 0) ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fixer.jobOffers.flatMap((offer) =>
            offer.photos?.map((photo, i) => (
              <div
                key={`${offer.id}-${i}`}
                className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative"
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Trabajo ${i + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            )),
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay fotos</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Este profesional aún no ha compartido fotos de sus trabajos realizados.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      {/* Enhanced Cover Photo */}
      <div className="h-80 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Profile Header Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Enhanced Profile Picture */}
              <div className="relative -mt-32 lg:-mt-40">
                <div className="relative">
                  <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden">
                    {fixer.photo ? (
                      <Image
                        src={fixer.photo || "/placeholder.svg"}
                        alt={fixer.name}
                        width={176}
                        height={176}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-4xl lg:text-5xl font-bold text-white">
                        {fixer.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Enhanced Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{fixer.name}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <span className="text-lg">{fixer.city}</span>
                      <span className="mx-3 text-gray-300">•</span>
                      <span className="flex items-center text-lg">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-1" />
                        {fixer.rating?.toFixed(1) || "Nuevo"}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{fixer.phone}</span>
                      </div>
                      {fixer.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{fixer.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleContact}
                      className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Contactar</span>
                    </button>
                    <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Stats */}
                <div className="flex items-center gap-8 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{fixer.completedJobs || 0}</div>
                    <div className="text-sm text-gray-500 font-medium">Trabajos</div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{fixer.rating?.toFixed(1) || "Nuevo"}</div>
                    <div className="text-sm text-gray-500 font-medium">Calificación</div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-6 h-6 text-amber-500" />
                      <span className="text-2xl font-bold text-gray-900">Pro</span>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Verificado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="border-t border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto">
              {[
                { id: "inicio", label: "Inicio", icon: "🏠" },
                { id: "servicios", label: "Servicios", icon: "🛠️" },
                { id: "reseñas", label: "Reseñas", icon: "⭐" },
                { id: "fotos", label: "Galería", icon: "📷" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-5 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 space-y-8 pb-12">{renderTabContent()}</div>
      </div>
    </div>
  )
}
