'use client';

import React from 'react';
import { Header } from '@/app/jobOfert/components_jo';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';

const AdvancedSearchPage = () => {
  const handleSearch = () => {
    // Aquí irá la lógica de búsqueda
    console.log('Aplicar búsqueda');
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
        
        <div className="flex justify-end">
          {/* Contador de resultados a la derecha */}
          <ResultsCounter total={0} loading={false} />
        </div>
        
        {/* Aquí puedes agregar tu contenido de búsqueda avanzada */}

        {/* Botón Aplicar Búsqueda */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Aplicar Búsqueda
          </button>
        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;

