'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { mockJobOffers } from '../../lib/mock-data';
import { JobOffer } from '../../lib/mock-data';
import { JobOfferCard } from '@/Components/Job-offers/Job-offer-card';
import { JobOfferModal } from '@/Components/Job-offers/Job-offer-modal';
import { MapView } from '@/Components/Job-offers/maps/MapView';
import { SearchHeader } from '@/Components/SearchHeader';
import { useLogClickMutation } from '../../redux/services/activityApi';
import { useLogSearchMutation, useUpdateFiltersMutation } from '../../redux/services/searchApi';
import { FiltersPanel } from '@/Components/FiltersPanel';
import { useAppSelector } from '../../redux/hooks';
import {
  selectSearchQuery,
  selectSelectedCities,
  selectSelectedJobTypes,
  selectSelectedFixerNames,
  selectRecentSearches,
} from '../../redux/slice/filterSlice';
import { ArrowLeft, Briefcase, Map, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function JobOffersPage() {
  const t= useTranslations('jobOffers');
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load offers on component mount
  useEffect(() => {
    setOffers(mockJobOffers);
  }, []);

  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCities = useAppSelector(selectSelectedCities);
  const selectedJobTypes = useAppSelector(selectSelectedJobTypes);
  const selectedFixerNames = useAppSelector(selectSelectedFixerNames);
  const recentSearches = useAppSelector(selectRecentSearches);
  const persona = { id: '507f1f77bcf86cd799439011', nombre: 'Usuario POC' };
  const [logClick] = useLogClickMutation();
  const handleCardClick = async (offer: JobOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);

    const activityData = {
      userId: persona.id,
      date: new Date().toISOString(),
      role: 'requester',
      type: 'click',
      metadata: {
        button: 'job_offer',
        jobTitle: offer.title || 'Sin título',
        jobId: offer.id,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await logClick(activityData).unwrap();
      console.log('Click registrado:', offer.title || offer.title);
    } catch (error) {
      console.error('Error al registrar clic:');
    }
  };

  const filteredOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => {
        const matchesSearch =
          !searchQuery ||
          (offer.description &&
            offer.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.fixerName && offer.fixerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.tags &&
            offer.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesCity =
          selectedCities.length === 0 || (offer.city && selectedCities.includes(offer.city));

        const matchesJobType =
          selectedJobTypes.length === 0 ||
          (offer.services && offer.services.some((service) => selectedJobTypes.includes(service)));

        return matchesSearch && matchesCity && matchesJobType;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [offers, searchQuery, selectedCities, selectedJobTypes]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCities, selectedJobTypes]);

  // Mantener actualizado el count de filteredOffers en un ref
  useEffect(() => {
    filteredOffersCountRef.current = filteredOffers.length;
  }, [filteredOffers.length]);

  // ============================================================================
  // SEARCH AND FILTER TRACKING - NEW IMPLEMENTATION
  // ============================================================================
  const [logSearch] = useLogSearchMutation();
  const [updateFilters] = useUpdateFiltersMutation();

  // Refs para rastrear valores anteriores y evitar envíos duplicados
  const previousSearchQueryRef = useRef<string>('');
  const previousRecentSearchesRef = useRef<string[]>([]);
  const previousFixerNamesRef = useRef<string[]>([]);
  const previousCitiesRef = useRef<string[]>([]);
  const previousJobTypesRef = useRef<string[]>([]);
  const isInitialMountRef = useRef<boolean>(true);
  const lastSearchSentRef = useRef<string>('');
  const filteredOffersCountRef = useRef<number>(0);

  // Función helper para obtener el valor del filtro fixer_name
  const getFixerNameValue = (): string => {
    if (selectedFixerNames.length === 0) {
      return 'not_applied';
    }
    // Concatenar todas las selecciones con comas
    return selectedFixerNames.join(',');
  };

  // Función helper para obtener el valor del filtro city
  const getCityValue = (): string => {
    if (selectedCities.length === 0) {
      return 'not_applied';
    }
    // Concatenar todas las selecciones con comas
    return selectedCities.join(',');
  };

  // Función helper para obtener el valor del filtro job_type
  const getJobTypeValue = (): string => {
    if (selectedJobTypes.length === 0) {
      return 'not_applied';
    }
    // Concatenar todas las selecciones con comas
    return selectedJobTypes.join(',');
  };

  // Detectar cuando se hace una búsqueda (POST)
  // Solo se envía cuando se hace click en el botón buscar (cuando se agrega a recentSearches)
  useEffect(() => {
    // Skip en el montaje inicial
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousSearchQueryRef.current = searchQuery;
      previousRecentSearchesRef.current = recentSearches;
      previousFixerNamesRef.current = selectedFixerNames;
      previousCitiesRef.current = selectedCities;
      previousJobTypesRef.current = selectedJobTypes;
      return;
    }

    // Detectar cuando se agrega una nueva búsqueda a recentSearches (indica que se hizo submit/click en buscar)
    const prevFirstSearch = previousRecentSearchesRef.current[0] || '';
    const currFirstSearch = recentSearches[0] || '';
    const hasNewSearch =
      recentSearches.length > 0 &&
      currFirstSearch !== prevFirstSearch &&
      currFirstSearch.trim().length > 0 &&
      currFirstSearch !== lastSearchSentRef.current;

    // Solo procesar si hay una búsqueda nueva (cuando se hace click en buscar)
    if (hasNewSearch) {
      const currentQuery = currFirstSearch.trim();

      // Pequeño delay para asegurar que filteredOffers se haya actualizado
      const timeoutId = setTimeout(async () => {
        // Verificar que el query sigue siendo válido y no ha cambiado
        if (recentSearches[0] === currentQuery && currentQuery.length > 0) {
          // Obtener el count actual desde el ref (siempre actualizado)
          const searchCount = filteredOffersCountRef.current;

          const searchData = {
            user_type: 'visitor',
            search_query: currentQuery,
            search_type: 'search_box',
            filters: {
              filter_1: {
                fixer_name: getFixerNameValue(),
                city: getCityValue(),
                job_type: getJobTypeValue(),
                search_count: searchCount,
              },
            },
          };

          try {
            console.log('Enviando búsqueda al backend:', JSON.stringify(searchData, null, 2));
            await logSearch(searchData).unwrap();
            console.log('Búsqueda registrada exitosamente:', currentQuery);
            lastSearchSentRef.current = currentQuery;
            previousSearchQueryRef.current = currentQuery;
            previousRecentSearchesRef.current = [...recentSearches];
          } catch (error) {
            console.error('Error al registrar búsqueda:', error);
            if (error && typeof error === 'object' && 'data' in error) {
              console.error('Detalles del error:', error.data);
            }
          }
        }
      }, 200); // Delay corto para asegurar que filteredOffers se actualice

      return () => clearTimeout(timeoutId);
    }

    // Actualizar refs para la próxima comparación solo cuando cambia recentSearches
    if (currFirstSearch !== prevFirstSearch) {
      previousRecentSearchesRef.current = [...recentSearches];
    }
  }, [recentSearches, logSearch, selectedFixerNames, selectedCities, selectedJobTypes]);

  // Detectar cambios en filtros (PATCH)
  useEffect(() => {
    // Skip en el montaje inicial
    if (isInitialMountRef.current) {
      return;
    }

    // Verificar si algún filtro cambió comparando con los valores anteriores
    // Usamos JSON.stringify para comparar arrays, ordenándolos para comparación correcta
    const prevFixerNames = [...previousFixerNamesRef.current].sort();
    const currFixerNames = [...selectedFixerNames].sort();
    const fixerNamesChanged = JSON.stringify(prevFixerNames) !== JSON.stringify(currFixerNames);

    const prevCities = [...previousCitiesRef.current].sort();
    const currCities = [...selectedCities].sort();
    const citiesChanged = JSON.stringify(prevCities) !== JSON.stringify(currCities);

    const prevJobTypes = [...previousJobTypesRef.current].sort();
    const currJobTypes = [...selectedJobTypes].sort();
    const jobTypesChanged = JSON.stringify(prevJobTypes) !== JSON.stringify(currJobTypes);

    // Solo enviar si hay un cambio real en los filtros
    if (fixerNamesChanged || citiesChanged || jobTypesChanged) {
      // Actualizar refs primero para evitar envíos duplicados
      previousFixerNamesRef.current = [...selectedFixerNames];
      previousCitiesRef.current = [...selectedCities];
      previousJobTypesRef.current = [...selectedJobTypes];

      // Usar un pequeño delay para asegurar que filteredOffers se haya actualizado
      const timeoutId = setTimeout(async () => {
        // Obtener el count actual desde el ref (siempre actualizado)
        const searchCount = filteredOffersCountRef.current;

        const filterData = {
          filters: {
            fixer_name: getFixerNameValue(),
            city: getCityValue(),
            job_type: getJobTypeValue(),
            search_count: searchCount,
          },
        };

        try {
          console.log('Enviando filtros al backend:', JSON.stringify(filterData, null, 2));
          await updateFilters(filterData).unwrap();
          console.log('Filtros actualizados exitosamente:', filterData);
        } catch (error) {
          console.error('Error al actualizar filtros:', error);
          if (error && typeof error === 'object' && 'data' in error) {
            console.error('Detalles del error:', error.data);
          }
        }
      }, 150); // Pequeño delay para que filteredOffers se actualice

      return () => clearTimeout(timeoutId);
    }
  }, [selectedFixerNames, selectedCities, selectedJobTypes, updateFilters]);
  // ============================================================================
  // END OF SEARCH AND FILTER TRACKING
  // ============================================================================

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
                <span className="font-medium">{t('backToHome')}</span>
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-800">{t('pageTitle')}</h1>
                <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                  {filteredOffers.length} {t('available')}
                </span>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
                <span>{t('viewModes.list')}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>{t('viewModes.map')}</span>
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
          {viewMode === 'list' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedOffers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <JobOfferCard offer={offer} onClick={() => handleCardClick(offer)} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredOffers.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
              <MapView offers={filteredOffers} onOfferClick={handleCardClick} />
            </div>
          )}

          {/* Empty State */}
          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">{t('emptyState.title')}</h3>
              <p className="text-gray-500 mt-1">{t('emptyState.description')}</p>
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
  );
}
