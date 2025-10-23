'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InputDemo } from '@/app/search/components_se/SearchBar';
import { SearchButton } from '@/app/search/components_se/SearchButton';
import { FilterButton } from '@/app/jobOfert/components_jo/FilterButton';
import { FilterDrawer } from '@/app/jobOfert/components_jo/FilterDrawer';
import Paginacion from './components_jo/Paginacion';
import PaginationInfo from './components_jo/PaginationInfo';
import PaginationSelector from './components_jo/PaginationSelector';
import CardJob from './components_jo/CardJob';
import SortCard from '@/components/sort/SortCard';
import { api, ApiResponse } from '@/lib/api';

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
}

interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
}

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

// ----------------------
// COMPONENTE FOOTER
// ----------------------

const Footer = () => (
    <footer className="bg-[#0D1B3E] text-white font-['Roboto']">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">Servineo</h2>
                <p className="text-white max-w-3xl mx-auto leading-relaxed text-lg">La plataforma líder para conectar hogares con profesionales calificados en Cochabamba. Calidad garantizada y servicio confiable.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Empresa</h3>
                    <ul className="space-y-3">
                        <li><a href="/info/about"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Sobre nosotros</span></a></li>
                        <li><a href="/info/join"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Trabaja con nosotros</span></a></li>
                        <li><a href="/info/testimonials"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Testimonios</span></a></li>
                        <li><a href="/info/support"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Apoyo</span></a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Legal</h3>
                    <ul className="space-y-3">
                        <li><a href="/info/privacy"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Política de privacidad</span></a></li>
                        <li><a href="/info/terms"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Acuerdos de usuario</span></a></li>
                        <li><a href="/info/cookies"><span className="text-white hover:text-gray-200 transition-colors cursor-pointer">Política de cookies</span></a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Contáctanos</h3>
                    <div className="space-y-4 text-white">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-5 w-5 text-blue-400 mr-4" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>Cochabamba, Bolivia</span>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone h-5 w-5 text-blue-400 mr-4" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
                            <span>+591 4 123-4567</span>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-5 w-5 text-blue-400 mr-4" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                            <span>contacto@servineo.bo</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
                    <div className="flex flex-row md:flex-col mt-2 md:space-y-3 space-x-4 md:space-x-0">
                        <a href="#" className="text-gray-400 hover:text-[#1AA7ED] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook h-6 w-6" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                        <a href="#" className="text-gray-400 hover:text-[#1AA7ED] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram h-6 w-6" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
                        <a href="#" className="text-gray-400 hover:text-[#1AA7ED] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter h-6 w-6" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm pt-8">
                <div>© 2024 Servineo. Todos los derechos reservados.</div>
                <div className="flex items-center space-x-4">
                    <span>Hecho con ❤️ en Cochabamba</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        <span>Sistema operativo</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default function JobOffers() {
  const [search, setSearch] = useState('');
  const [trabajos, setTrabajos] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    range: [],
    city: '',
    category: [],
  });
  const [sortBy, setSortBy] = useState<string>('recent');
  const defaultFilters: FilterState = { range: [], city: '', category: [] };
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const fetchOffers = useCallback(async (
    searchText: string,
    appliedFilters: FilterState,
    appliedSort: string,
    page: number = 1,
    limit: number = registrosPorPagina
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchText.trim()) {
        params.append('search', searchText);
      }

      if (appliedFilters.range && appliedFilters.range.length > 0) {
        appliedFilters.range.forEach((r) => {
          params.append('range', r);
        });
      }
      if (appliedFilters.city) {
        params.append('city', appliedFilters.city);
      }
      if (appliedFilters.category && appliedFilters.category.length > 0) {
        appliedFilters.category.forEach((c) => {
          params.append('category', c);
        });
      }

      if (appliedSort) {
        params.append('sortBy', appliedSort);
      }
      
       params.append('page', page.toString());
       params.append('limit', limit.toString());

      const url = `/api/devmaster/offers?${params.toString()}`;
      const response: ApiResponse<OfferResponse> = await api.get(url);
      
      if (response.success && response.data) {
          setTrabajos(response.data.data);
          setPaginaActual(page);
          setRegistrosPorPagina(limit);
           setTotalRegistros(response.data.total);
      } else {
        const errorMsg = response.error || 'Error al cargar las ofertas';
        setError(errorMsg);
        setTrabajos([]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMsg);
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToInitial = () => {
    setFilters(defaultFilters);
    setSortBy('recent');
    setValidationMessage(null);
    fetchOffers('', defaultFilters, 'recent');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 100) {
      setSearch(value.slice(0, 100));
      setValidationMessage('Límite máximo de 100 caracteres');
      return;
    }

    setSearch(value);
    if (validationMessage === 'Límite máximo de 100 caracteres') {
      setValidationMessage(null);
    }
  };

  const handleSearch = async () => {
    setValidationMessage(null);
    const trimmedSearch = search.trim();

    if (trimmedSearch.length === 0) {
      setValidationMessage('Debe ingresar un término de búsqueda válido');
      return;
    }

    if (trimmedSearch.length < 2) {
      setValidationMessage('Introduce al menos dos caracteres para buscar.');
      return;
    }

    const allowedRegex = /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/;
    if (!allowedRegex.test(trimmedSearch)) {
      setValidationMessage('Búsqueda invalida por contener caracteres especiales no permitidos. Solo se permiten los carateres especiales "," , "_" , " ." y "-"');
      return;
    }

    await fetchOffers(trimmedSearch, filters, sortBy);
  };

  useEffect(() => {
    fetchOffers('', { range: [], city: '', category: [] }, 'recent');
  }, [fetchOffers]);

  const handleFiltersApply = async (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
    await fetchOffers(search, appliedFilters, sortBy);
  };

  const sortMap: Record<string, string> = {
    Destacados: 'rating',
    'Los más recientes': 'recent',
    'Los más antiguos': 'oldest',
    'Nombre A-Z': 'name_asc',
    'Nombre Z-A': 'name_desc',
    'Num de contacto asc': 'contact_asc',
    'Num de contacto desc': 'contact_desc',
  };

  const sortMapInverse: Record<string, string> = Object.fromEntries(
    Object.entries(sortMap).map(([key, value]) => [value, key])
  );

  const handleSortChange = async (option: string) => {
    const backendSort = sortMap[option] || 'recent';
    setSortBy(backendSort);
    await fetchOffers(search, filters, backendSort);
  };

 
const trabajosVisibles = trabajos;
  useEffect(() => {
    setPaginaActual(1);
  }, [registrosPorPagina]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <h1 className="mt-8 sm:mt-12 md:mt-16 lg:mt-18 mb-0 sm:mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-12 lg:px-24">
        Ofertas de trabajo
      </h1>

      {/* Barra sticky */}
      <div className="`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-2 sm:py-3 md:py-4 shadow-md mb-1 sm:mb-2 ${
        isDrawerOpen ? 'z-10' : 'z-50'">
        {/* Fila 1: Filtro + Búsqueda + Botón */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-shrink-0">
            <FilterButton onClick={toggleDrawer} />
          </div>

          {/* Barra de búsqueda - crece para llenar espacio */}
          <div className="flex-1 min-w-0">
            <InputDemo
              value={search}
              onChange={handleInputChange}
              onClear={() => {
                setSearch('');
                resetToInitial();
              }}
              onKeyDown={handleKeyDown}
              hasError={!!validationMessage}
            />
          </div>

          {/* Botón de Buscar - ancho fijo responsive */}
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <SearchButton onClick={handleSearch} disabled={loading} />
          </div>
        </div>

        {/* Mensaje de validación dentro del sticky */}
        {validationMessage && (
          <div className="mb-2 sm:mb-3 text-left">
            <p className="text-red-500 text-sm sm:text-base">{validationMessage}</p>
          </div>
        )}

        {/* Fila 2: Selector de paginación + Ordenamiento */}
        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <div className="w-full sm:w-auto">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={(valor) => setRegistrosPorPagina(valor)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <SortCard value={sortMapInverse[sortBy]} onSelect={handleSortChange} />
            </div>
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {error && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded text-sm sm:text-base">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded text-sm sm:text-base">
          Cargando ofertas...
        </div>
      )}
      
      <FilterDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFiltersApply={handleFiltersApply}
      />

      {!loading && trabajos.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-3 sm:mb-4">
          <div className="flex justify-center">
            <PaginationInfo
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
              // ELIMINAR ESTAS PROPIEDADES, YA QUE NO ESTÁN DEFINIDAS EN LA INTERFAZ
              /*
              indiceInicio={indiceInicio} 
              indiceFin={indiceFin}
              */
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
        {!loading && trabajos.length > 0 ? (
          <CardJob trabajos={trabajos} />
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl font-roboto font-normal">
              No se encontraron resultados
              {search.trim() && (
                <> para <span className="font-bold">&quot;{search.trim()}&quot;</span></>
              )}
            </p>
          </div>
        ) : null}
      </div>

      {!loading && trabajos.length > 0 && (
        <div className="mt-8 mb-24 flex justify-center">
          <Paginacion
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
 onChange={(newPage) =>
    fetchOffers(search, filters, sortBy, newPage, registrosPorPagina)
  }          />
        </div>
      )}
    </main>

    {/* AQUÍ SE INSERTA EL FOOTER */}
    <Footer />
    </>
  );
}