'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import Header from './components_jo/Header';
import Footer from './components_jo/Footer';

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
  const stickyRef = useRef<HTMLDivElement | null>(null);
 
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
      console.log('Fetching URL:', url);
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

  useEffect(() => {
  // Resetear a página 1 cuando cambia registrosPorPagina
  const newPage = 1;
  setPaginaActual(newPage);
  fetchOffers(search, filters, sortBy, newPage, registrosPorPagina);
}, [registrosPorPagina, fetchOffers]);



  const resetToInitial = () => {
    setFilters(defaultFilters);
    setSortBy('recent');
    setValidationMessage(null);
    fetchOffers('', defaultFilters, 'recent');
  };
  
const handleRegistrosPorPaginaChange = (valor: number) => {
  setRegistrosPorPagina(valor);
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

  // Mantener la barra sticky visible debajo del header fijo.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const hdr = document.querySelector('header');
      const h = hdr ? (hdr as HTMLElement).getBoundingClientRect().height : 0;
      if (stickyRef.current) {
        stickyRef.current.style.top = `${h}px`;
        // aseguramos que la barra sticky quede por debajo del header (header usa z-50)
        stickyRef.current.style.zIndex = '40';
      }
    };

    update();
    window.addEventListener('resize', update);

    // Observamos cambios en header (ej. imagen cargada que altera alturas)
    const hdrEl = document.querySelector('header');
    const mo = hdrEl ? new MutationObserver(update) : null;
    if (mo && hdrEl) mo.observe(hdrEl, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', update);
      if (mo) mo.disconnect();
    };
  }, []);

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
      {/* Site header component (fixed) - no borraremos la barra sticky existente */}
      <Header />

      <h1 className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 sm:mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 sm:pt-4 md:pt-6 px-3 sm:px-6 md:px-12 lg:px-24">
        Ofertas de Trabajo
      </h1>

      {/* Barra sticky */}
      <div ref={stickyRef} className="`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-2 sm:py-3 md:py-4 shadow-md mb-1 sm:mb-2 ${
        isDrawerOpen ? 'z-10' : 'z-50'">
        {/* Fila 1: Filtro + Búsqueda + Botón */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-shrink-0">
            <FilterButton onClick={toggleDrawer} />
          </div>

          {/* Barra de búsqueda - crece para llenar espacio */}
          <div className="flex-1 min-w-0 relative">
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
            {/* Mensaje de validación: absoluto para no empujar otros elementos y alineado al inicio del input */}
            {validationMessage && (
              <div className="absolute left-0 top-full mt-1 w-full z-50">
                <p className="text-red-500 text-sm sm:text-base">{validationMessage}</p>
              </div>
            )}
          </div>

          {/* Botón de Buscar - ancho fijo responsive */}
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <SearchButton onClick={handleSearch} disabled={loading} />
          </div>
        </div>

        {/* mensaje de validación movido dentro del contenedor del input para evitar que empuje layout */}

        {/* Fila 2: Selector de paginación + Ordenamiento */}
        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <div className="w-full sm:w-auto">
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
               onChange={handleRegistrosPorPaginaChange}
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

    <Footer />
    </>
  );
}