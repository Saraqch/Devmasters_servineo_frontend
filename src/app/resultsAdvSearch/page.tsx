'use client';
import React, { useState } from 'react';
import Header from './components_RAS/Header';
import Footer from './components_RAS/Footer';
import PaginationInfo from './components_RAS/PaginationInfo';
import PaginationSelector from './components_RAS/PaginationSelector';
import Paginacion from './components_RAS/Paginacion';
import AppliedFilters from './components_RAS/AppliedFilters';
import useAppliedFilters from '../jobOfert/hooks/useAppliedFilters';

export default function ResultsAdvSearchPage() {
  // Estados locales para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [totalRegistros] = useState(85); // ejemplo de total de resultados

  // Cambiar página
  const handlePageChange = (num: number) => {
    setPaginaActual(num);
  };

  // Cambiar cantidad de registros por página
  const handleRegistrosChange = (valor: number) => {
    setRegistrosPorPagina(valor);
    setPaginaActual(1); // resetear a la primera página
  };

  const { showAppliedFilters, appliedParams, handleClearApplied } = useAppliedFilters();

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Resultados de Búsqueda Avanzada
        </h1>

        {/* Filtros aplicados (si vienen desde la búsqueda avanzada) */}
        {showAppliedFilters && appliedParams && (
          <AppliedFilters params={appliedParams} onClear={handleClearApplied} />
        )}

        {/* Componente selector de registros por página */}
        <PaginationSelector
          registrosPorPagina={registrosPorPagina}
          onChange={handleRegistrosChange}
        />

        {/* Componente de información de paginación - Ahora en el medio */}
        <div className="flex justify-center my-4">
          <PaginationInfo
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
          />
        </div>

        {/* Componente de botones de paginación */}
        <Paginacion
          paginaActual={paginaActual}
          registrosPorPagina={registrosPorPagina}
          totalRegistros={totalRegistros}
          onChange={handlePageChange}
        />
      </main>
      <Footer />
    </>
  );
}



