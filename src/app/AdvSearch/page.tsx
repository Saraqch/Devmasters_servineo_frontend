'use client';

import React, { useState } from 'react';
import { Header } from '@/app/jobOfert/components_jo';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import DateFilterSelector from '@/app/AdvSearch/components_AS/DateFilterSelector'; // <-- import correcto

const AdvancedSearchPage: React.FC = () => {
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    console.log('Aplicar búsqueda');

    // Simulamos una búsqueda (reemplaza por tu lógica real)
    setTimeout(() => {
      setTotalResults(Math.floor(Math.random() * 100));
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Header arriba */}
      <Header />

      {/* Contenido principal */}
      <main className="px-4 sm:px-6 md:px-12 lg:px-24 mt-20 sm:mt-24 md:mt-28 lg:mt-32">
        {/* Título centrado */}
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          Búsqueda Avanzada
        </h1>

        {/* Contador de resultados a la derecha */}
        <div className="flex justify-end mb-6">
          <ResultsCounter total={totalResults} loading={loading} />
        </div>

        {/* Aquí se monta tu selector de fecha (usa internamente CalendarComponent) */}
        <div className="mt-6">
          <DateFilterSelector />
        </div>

        {/* Botón Aplicar Búsqueda */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md`}
          >
            {loading ? 'Buscando...' : 'Aplicar Búsqueda'}
          </button>
        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;


