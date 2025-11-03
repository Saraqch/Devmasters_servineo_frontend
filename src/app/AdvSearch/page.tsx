'use client';

import React from 'react';
import { Header } from '@/app/jobOfert/components_jo';

const AdvancedSearchPage = () => {
  return (
    <>
      {/* Header arriba */}
      <Header />

      {/* Contenido principal */}
      <main className="px-4 sm:px-6 md:px-12 lg:px-24 mt-20 sm:mt-24 md:mt-28 lg:mt-32">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
          Hola Mundo desde Búsqueda Avanzada
        </h1>
        {/* Aquí puedes agregar tu contenido de búsqueda avanzada */}
      </main>
    </>
  );
};

export default AdvancedSearchPage;


