"use client"

import { useState, useEffect, useMemo } from "react"
import { mockJobOffers } from "../lib/mock-data"
import { JobOffer } from "../lib/mock-data"
import { JobOfferCard } from "@/Components/Job-offers/Job-offer-card"
import { JobOfferModal } from "@/Components/Job-offers/Job-offer-modal"
import { MapView } from "@/Components/Job-offers/maps/MapView"
import { SearchHeader } from "@/Components/SearchHeader"
import { FiltersPanel } from "@/Components/FiltersPanel"
import { useAppSelector } from "../redux/hooks"
import {
  selectSearchQuery,
  selectSelectedCities,
  selectSelectedJobTypes,
} from "../redux/slice/filterSlice"
import { ArrowLeft, Briefcase, Map, List, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function JobOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Load offers on component mount
  useEffect(() => {
    setOffers(mockJobOffers)
  }, [])

  
  const searchQuery = useAppSelector(selectSearchQuery)
  const selectedCities = useAppSelector(selectSelectedCities)
  const selectedJobTypes = useAppSelector(selectSelectedJobTypes)
  

  
  const filteredOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => {
        const matchesSearch =
          !searchQuery ||
          (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.fixerName && offer.fixerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.tags && offer.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))

        const matchesCity = 
          selectedCities.length === 0 || 
          (offer.city && selectedCities.includes(offer.city))

        const matchesJobType = 
          selectedJobTypes.length === 0 || 
          (offer.services && offer.services.some(service => 
            selectedJobTypes.includes(service)
          ))

        return matchesSearch && matchesCity && matchesJobType
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [offers, searchQuery, selectedCities, selectedJobTypes])

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCities, selectedJobTypes])

  const handleCardClick = (offer: JobOffer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="font-medium">Inicio</span>
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-800">Ofertas de Trabajo</h1>
                <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                  {filteredOffers.length} disponibles
                </span>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
                <span>Lista</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "map" 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mapa</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchHeader />
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-full md:w-80 flex-shrink-0 border-r border-gray-100 bg-white p-4">
          <FiltersPanel />
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden p-4 border-b border-gray-100">
          <FiltersPanel />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-50 min-h-[calc(100vh-180px)]">
          {viewMode === "list" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedOffers.map((offer, index) => (
                  <div 
                    key={offer.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <JobOfferCard 
                      offer={offer} 
                      onClick={() => handleCardClick(offer)} 
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredOffers.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-[calc(100vh-250px)] rounded-lg overflow-hidden border border-gray-200 bg-white">
              <MapView 
                offers={filteredOffers} 
                onOfferClick={handleCardClick} 
              />
            </div>
          )}

          {/* Empty State */}
          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No se encontraron ofertas</h3>
              <p className="text-gray-500 mt-1">
                No hay ofertas que coincidan con tu búsqueda o filtros actuales.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Offer Details Modal */}
      <JobOfferModal 
        offer={selectedOffer} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}