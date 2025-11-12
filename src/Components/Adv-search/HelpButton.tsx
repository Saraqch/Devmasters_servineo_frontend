// HelpButton.tsx
'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Hash,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Tag,
  Calendar,
  Star,
  CheckCircle,
  X,
  RotateCcw,
} from 'lucide-react';

export function HelpButton() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleClick = () => {
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed right-4 sm:right-6 top-20 lg:top-24 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label="Ayuda"
        title="Ayuda"
      >
        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Panel lateral de Ayuda */}
      {isHelpOpen && (
        <>
          {/* Panel derecho - Estilo similar a filtros */}
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-gray-200">
            {/* Header - Ayuda con X */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Ayuda</h1>
              <button
                onClick={closeHelp}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>

            {/* Content - Steps tipo filtros */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {/* Sección: Guía de Búsqueda Avanzada */}
              <div className="bg-blue-600 text-white px-4 py-3 rounded font-semibold text-sm">
                Guía de Búsqueda Avanzada
              </div>

              {/* Step 1 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Search className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">1.</span> Dirigirse a la barra
                      de búsqueda y llenar en el campo el servicio que necesita buscar de manera
                      personalizada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Hash className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">2.</span> Según el texto
                      ingresado, puede buscar solo en el título de la oferta de trabajo o por
                      palabra exacta en el título y la descripción.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Filter className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">3.</span> Seleccionar el
                      filtrado de nombre de fixer de acuerdo a lo que se requiera.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">4.</span> Seleccionar la ciudad
                      de interés para filtrar los resultados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">5.</span> Seleccionar el tipo de
                      trabajo. Ejemplo: si selecciona &quot;Pintor&quot;, se mostrarán resultados de
                      pintores.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">6.</span> Hacer click en el
                      componente de precio y seleccionar el rango deseado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 7 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">7.</span> En la sección de tipo
                      de trabajo, seleccionar y deacuerdo a su eleccion se mostrarán las respectivas
                      etiquetas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 8 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">8.</span> Seleccionar fecha de
                      publicación: más recientes, más antiguos o fecha específica mediante el
                      calendario.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 9 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Star className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">9.</span> Seleccionar rango de
                      calificación (1-5 estrellas). Al hacer click en una estrella muestra subrangos
                      (1-9).
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 10 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">10.</span> Hacer click en
                      &quot;Aplicar búsqueda&quot; para mostrar resultados con todos los filtros
                      seleccionados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 11 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <RotateCcw className="text-blue-600" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-600">11.</span> Usar el botón
                      &quot;Limpiar datos&quot; para borrar todos los filtros y volver al estado
                      inicial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
