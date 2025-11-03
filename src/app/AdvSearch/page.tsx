'use client';

import React from 'react';
import Header from '@/app/jobOfert/components_jo/Header';
import { ResultsCounter } from '@/app/AdvSearch/components_AS/ResultsCounter';
import { InputOnlySearch } from '@/app/jobOfert/components_jo/Search/InputOnlySearch';
import { SearchCheckboxes } from './components_AS/SearchCheckboxes';
import { HelpButton } from './components_AS/HelpButton';

const AdvancedSearchPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [titleOnly, setTitleOnly] = React.useState(false);
  const [exactWords, setExactWords] = React.useState(false);
  const [resultsCount] = React.useState(0);
  const [loading] = React.useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Buscar desde AdvancedSearch:', query);
  };

  return (
    <>
      <Header />
      
      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* Main con padding-top para compensar el header fixed */}
      <main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
          Búsqueda Avanzada
        </h1>
        
        {/* Contenedor principal para definir el ancho máximo */}
        <div className="max-w-7xl mx-auto">
          
          {/* Fila 1: Contador de Resultados (Pushed a la Derecha) */}
          {/* Reducimos el margen inferior a mb-4 para que el siguiente elemento pueda subir */}
          <div className="flex justify-end mb-1">
            {/* El contador tiene un ancho fijo para que no se estire */}
            <div className="w-full sm:w-80"> 
              <ResultsCounter total={resultsCount} loading={loading} />
            </div>
          </div>

          {/* Fila 2: Barra de Búsqueda y Checkboxes (Centrados y del Mismo Tamaño) */}
          {/* Añadimos un margen superior negativo (-mt-4) para tirar este bloque hacia arriba, acercándolo al contador */}
          <div className="w-full sm:w-[700px] mx-auto -mt-60"> 
            
            {/* Barra de Búsqueda (InputOnlySearch toma todo el ancho del contenedor de 700px) */}
            <div className="mb-4">
              <InputOnlySearch onSearch={handleSearch} />
            </div>
            
            {/* Checkboxes (automáticamente toma el mismo ancho de 700px, asegurando el mismo tamaño) */}
            <div>
              <SearchCheckboxes
                titleOnly={titleOnly}
                setTitleOnly={setTitleOnly}
                exactWords={exactWords}
                setExactWords={setExactWords}
              />
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
};

export default AdvancedSearchPage;