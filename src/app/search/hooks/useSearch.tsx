import { useState, useMemo, useCallback } from "react";
import React from "react";

// Define la estructura de lo que el hook devolverá
interface UseSearchReturn {
  searchTerm: string;
  isSearchDisabled: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
}

// Define la longitud mínima requerida para la búsqueda
const MIN_LENGTH = 2; 

export const useSearch = (): UseSearchReturn => {
  // 1. Estado para almacenar el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 2. Lógica de validación (usamos useMemo para memorizar el cálculo)
  const isSearchDisabled = useMemo(() => {
    return searchTerm.length < MIN_LENGTH;
  }, [searchTerm]);

  // 3. Función para manejar los cambios en el input (usamos useCallback)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 4. Función para manejar el click del botón de búsqueda (usamos useCallback)
  const handleSearch = useCallback(() => {
    if (!isSearchDisabled) {
      console.log("Iniciando búsqueda con:", searchTerm);
      // **TODO:** Aquí debes agregar la lógica para navegar a la página de resultados 
      // o llamar a la API del backend.
    }
  }, [isSearchDisabled, searchTerm]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    isSearchDisabled,
    handleInputChange,
    handleSearch,
    handleClearSearch,
  };
};