'use client';

import React, { useState, useEffect } from 'react';

// Interfaz para las opciones del select
interface Option {
  label: string;
  value: string;
}

interface DropdownListProps {
  onFilterChange?: (filters: { price?: string; tag?: string }) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ onFilterChange }) => {
  const [price, setPrice] = useState<string>('');
  const [tag, setTag] = useState<string>('');

  // NUEVOS ESTADOS para manejar las etiquetas dinámicas
  const [availableTagOptions, setAvailableTagOptions] = useState<Option[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Hook que notifica al componente padre (Búsqueda Avanzada) de los cambios
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ price, tag });
    }
  }, [price, tag, onFilterChange]);


  // HOOK CRUCIAL: Carga las etiquetas del Backend al montar el componente
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // ⚠️ SOLUCIÓN: Cambia la URL para incluir el prefijo 'devmaster'
        const response = await fetch('/api/devmaster/tags');
        
        if (!response.ok) {
          throw new Error('Error al cargar las etiquetas');
        }
        // Recibe el array de strings: ["pisos", "paredes", ...]
        const tagValues: string[] = await response.json();
        
        // Mapear los valores a objetos { label, value }
        const dynamicTags: Option[] = tagValues.map((value) => ({
          // Genera un Label amigable (ej: 'pisos' -> 'Pisos')
          label: value.charAt(0).toUpperCase() + value.slice(1), 
          value: value,
        }));

        // Establecer las opciones, añadiendo el valor inicial "Todas las etiquetas"
        setAvailableTagOptions([
          { label: 'Todas las etiquetas', value: '' },
          ...dynamicTags,
        ]);
      } catch (error) {
        console.error('No se pudieron cargar las etiquetas:', error);
        // Fallback en caso de error de red o API
        setAvailableTagOptions([{ label: 'Todas las etiquetas', value: '' }]);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []); // Dependencia vacía: se ejecuta solo una vez al inicio.

  // Opciones de precio (se mantienen estáticas)
  const priceOptions = [
    { label: 'Todos los precios', value: '' },
    { label: 'De 30 a 100 Bs', value: 'low' },
    { label: 'De 101 a 200 Bs', value: 'medium' },
    { label: 'De 201 a 300 Bs', value: 'high' },
    { label: 'De 301 a 400 Bs', value: 'high' },
  ];

  // NOTA: La antigua constante tagOptions ha sido eliminada y reemplazada por availableTagOptions

  return (
    <div className="flex flex-col space-y-4 w-full sm:w-64">
      {/* Dropdown de Precio */}
      <div className="flex flex-col w-full">
        <label className="text-base mb-2">Precio:</label>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="sm:w-[700px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {priceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown de Etiquetas (¡DINÁMICO!) */}
      <div className="flex flex-col w-full">
        <label className="text-base mb-2">Etiqueta:</label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="sm:w-[700px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loadingTags} // Deshabilitar mientras carga
        >
          {loadingTags && (
            <option value="" disabled>Cargando etiquetas...</option>
          )}
          {!loadingTags &&
            availableTagOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownList;