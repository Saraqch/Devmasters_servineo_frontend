// src/app/jobOfert/page.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import {
  Header,
  Footer,
  NoResultsMessage,
  CardJob,
} from '@/app/jobOfert/components_jo';

import {
  SearchBox,
  FilterButton,
  FilterPanel,
  Pagination,
  PageSizeSelector,
  SortSelect,
} from '@/lib/modular/components';

import { useAppDispatch, useAppSelector } from './hooks/hook';
import {
  fetchOffers,
  setSearch,
  setFilters,
  setSortBy,
  setRegistrosPorPagina,
  setPaginaActual,
  FilterState,
} from './lib/slice';
import { useSyncUrlParams } from './hooks/useSyncUrlParams';
import { FilterConfig } from '@/lib/modular/types/base.types';

// ✅ Configuración actualizada con los nuevos tipos
const FILTER_CONFIG: FilterConfig[] = [
  {
    key: 'range',
    label: 'Nombre de Fixer',
    type: 'checkbox-multi', // ✅ Nuevo tipo explícito
    columns: 2, // ✅ Layout de 2 columnas
    defaultOpen: true, // ✅ Abierto por defecto
    options: [
      { value: 'De (A-C)', label: 'De (A-C)' },
      { value: 'De (D-F)', label: 'De (D-F)' },
      { value: 'De (G-I)', label: 'De (G-I)' },
      { value: 'De (J-L)', label: 'De (J-L)' },
      { value: 'De (M-Ñ)', label: 'De (M-Ñ)' },
      { value: 'De (O-Q)', label: 'De (O-Q)' },
      { value: 'De (R-T)', label: 'De (R-T)' },
      { value: 'De (U-W)', label: 'De (U-W)' },
      { value: 'De (X-Z)', label: 'De (X-Z)' },
    ],
  },
  {
    key: 'city',
    label: 'Ciudad',
    type: 'checkbox-single', 
    defaultOpen: false,
    options: [
      { value: 'Beni', label: 'Beni' },
      { value: 'Chuquisaca', label: 'Chuquisaca' },
      { value: 'Cochabamba', label: 'Cochabamba' },
      { value: 'La Paz', label: 'La Paz' },
      { value: 'Oruro', label: 'Oruro' },
      { value: 'Pando', label: 'Pando' },
      { value: 'Potosí', label: 'Potosí' },
      { value: 'Santa Cruz', label: 'Santa Cruz' },
      { value: 'Tarija', label: 'Tarija' },
    ],
  },
  {
    key: 'category',
    label: 'Tipo de Trabajo',
    type: 'checkbox-multi', // ✅ Selección múltiple
    columns: 1,
    defaultOpen: false,
    options: [
      { value: 'Albañil', label: 'Albañil' },
      { value: 'Carpintero', label: 'Carpintero' },
      { value: 'Cerrajero', label: 'Cerrajero' },
      { value: 'Decorador', label: 'Decorador' },
      { value: 'Electricista', label: 'Electricista' },
      { value: 'Fontanero', label: 'Fontanero' },
      { value: 'Fumigador', label: 'Fumigador' },
      { value: 'Instalador', label: 'Instalador' },
      { value: 'Jardinero', label: 'Jardinero' },
      { value: 'Limpiador', label: 'Limpiador' },
      { value: 'Mecánico', label: 'Mecánico' },
      { value: 'Montador', label: 'Montador' },
      { value: 'Pintor', label: 'Pintor' },
      { value: 'Pulidor', label: 'Pulidor' },
      { value: 'Soldador', label: 'Soldador' },
      { value: 'Techador', label: 'Techador' },
      { value: 'Vidriero', label: 'Vidriero' },
      { value: 'Yesero', label: 'Yesero' },
    ],
  },
];

const SORT_OPTIONS = [
  { label: 'Destacados', value: 'rating' },
  { label: 'Los más recientes', value: 'recent' },
  { label: 'Los más antiguos', value: 'oldest' },
  { label: 'Nombre A-Z', value: 'name_asc' },
  { label: 'Nombre Z-A', value: 'name_desc' },
  { label: 'Num de contacto asc', value: 'contact_asc' },
  { label: 'Num de contacto desc', value: 'contact_desc' },
];

export default function JobOffersPage() {
  const dispatch = useAppDispatch();

  const {
    trabajos,
    loading,
    error,
    filters,
    sortBy,
    search,
    paginaActual,
    registrosPorPagina,
    totalRegistros,
  } = useAppSelector((state) => state.jobOffers);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

  useSyncUrlParams({
    search,
    filters,
    sortBy,
    paginaActual,
    registrosPorPagina,
  });

  useEffect(() => {
    if (isInitialMount.current) {
      dispatch(
        fetchOffers({
          searchText: '',
          filters: { range: [], city: '', category: [] },
          sortBy: 'recent',
          page: 1,
          limit: 10,
        }),
      );
      isInitialMount.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const hdr = document.querySelector('header');
      const h = hdr ? (hdr as HTMLElement).getBoundingClientRect().height : 0;
      if (stickyRef.current) {
        stickyRef.current.style.top = `${h}px`;
        stickyRef.current.style.zIndex = '40';
      }
    };

    update();
    window.addEventListener('resize', update);

    const hdrEl = document.querySelector('header');
    const mo = hdrEl ? new MutationObserver(update) : null;
    if (mo && hdrEl) mo.observe(hdrEl, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', update);
      if (mo) mo.disconnect();
    };
  }, []);

  const handleSearchSubmit = (query: string) => {
    dispatch(setSearch(query));
    dispatch(setPaginaActual(1));
    dispatch(
      fetchOffers({
        searchText: query,
        filters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  // ✅ Ajustado para recibir los filtros correctamente tipados
  const handleFiltersApply = (appliedFilters: FilterState) => {
    dispatch(setFilters(appliedFilters));
    dispatch(setPaginaActual(1));
    dispatch(
      fetchOffers({
        searchText: search,
        filters: appliedFilters,
        sortBy,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handleSortChange = (option: string) => {
    dispatch(setSortBy(option));
    dispatch(setPaginaActual(1));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy: option,
        page: 1,
        limit: registrosPorPagina,
      }),
    );
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPaginaActual(newPage));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        page: newPage,
        limit: registrosPorPagina,
      }),
    );
  };

  const handleRegistrosPorPaginaChange = (valor: number) => {
    dispatch(setRegistrosPorPagina(valor));
    dispatch(setPaginaActual(1));
    dispatch(
      fetchOffers({
        searchText: search,
        filters,
        sortBy,
        page: 1,
        limit: valor,
      }),
    );
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <Header />

      <h1 className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 px-3">
        Ofertas de Trabajo
      </h1>

      <div
        ref={stickyRef}
        className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-3 shadow-md ${
          isDrawerOpen ? 'z-10' : 'z-50'
        }`}
      >
        <div className="flex flex-row items-center gap-2 mb-3">
          <FilterButton onClick={() => setIsDrawerOpen(true)} />
          <div className="flex-1">
            <SearchBox
              onSearch={handleSearchSubmit}
              placeholder="¿Qué servicio necesitas?"
              minLength={2}
              maxLength={100}
              regex={
                /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/
              }
              debounceMs={300}
              size="md"
              variant="default"
            />
          </div>
        </div>

        {!loading && trabajos.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-stretch">
            <PageSizeSelector
              value={registrosPorPagina}
              onChange={handleRegistrosPorPaginaChange}
              options={[10, 20, 50, 100]}
              label="Mostrar"
              variant="headlessui"
            />
            <SortSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
              variant="card"
              size="md"
              label=""
            />
          </div>
        )}
      </div>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24">
        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">{error}</div>
        )}
        {loading && (
          <div className="text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded">
            Cargando ofertas...
          </div>
        )}

        {/* ✅ Drawer simplificado - FilterPanel maneja overlay y panel */}
        <FilterPanel
          variant="drawer"
          isOpen={isDrawerOpen}
          config={FILTER_CONFIG}
          initialFilters={filters}
          onClose={() => setIsDrawerOpen(false)}
          onApply={handleFiltersApply}
          autoApply={true}
          closeOnApply={false}
          showResetButton={true}
          drawerWidth="30%"
          drawerPosition="left"
          showOverlay={true}
        />

        {!loading && trabajos.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-4">
            <div className="flex justify-center">
              <div className="text-sm text-gray-600 mt-3">
                Mostrando {(paginaActual - 1) * registrosPorPagina + 1} -{' '}
                {Math.min(paginaActual * registrosPorPagina, totalRegistros)} de {totalRegistros}{' '}
                resultados
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto">
          {!loading && trabajos.length > 0 ? (
            <CardJob trabajos={trabajos} />
          ) : !loading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {!loading && trabajos.length > 0 && (
          <div className="mt-8 mb-24 flex justify-center">
            <Pagination
              currentPage={paginaActual}
              totalItems={totalRegistros}
              pageSize={registrosPorPagina}
              onPageChange={handlePageChange}
              maxVisible={5}
              showFirstLast={false}
              showInfo={false}
              variant="default"
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}