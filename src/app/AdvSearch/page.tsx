'use client';

import React, { useState } from 'react';
import { Header } from '@/app/jobOfert/components_jo';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import DateFilterSelector from '@/app/AdvSearch/components_AS/DateFilterSelector';
import ButtonAplicarBus from '@/app/AdvSearch/components_AS/ButtonAplicarBus';
import CalificacionEstrella from '@/app/AdvSearch/components_AS/CalificacionEstrella';

const AdvancedSearchPage: React.FC = () => {
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    console.log('Aplicar búsqueda');

    // Simulamos búsqueda
    setTimeout(() => {
      setTotalResults(Math.floor(Math.random() * 100));
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Header />

      <main className="px-4 sm:px-6 md:px-12 lg:px-24 mt-20 sm:mt-24 md:mt-28 lg:mt-32">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          Búsqueda Avanzada
        </h1>

        <div className="flex justify-end mb-6">
          <ResultsCounter total={totalResults} loading={loading} />
        </div>

        {/* Fecha de Publicación y Calificación en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Fecha de Publicación - Izquierda */}
          <div>
            <DateFilterSelector />
          </div>

          {/* Calificación - Derecha */}
          <div>
            <CalificacionEstrella />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ButtonAplicarBus onClick={handleSearch} loading={loading} />
        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;


