 import { useState, useMemo, useCallback } from "react";
import React from "react";

const MIN_LENGTH = 2; // Define la longitud mínima requerida para la búsqueda
const ERROR_DURATION_MS = 3000; // El mensaje de error desaparecerá después de 3 segundos

// Define la estructura de lo que el hook devolverá
interface UseSearchReturn {
  searchTerm: string;
  isSearchDisabled: boolean;
  isMinLengthError: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
}

export const useSearch = (onSearchTriggered: (term: string) => void): UseSearchReturn => {
  // 1. Estado para almacenar el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");

   // 2. Estado para el mensaje de error
  const [isMinLengthError, setIsMinLengthError] = useState(false);

  // 3. Lógica de validación (usamos useMemo para memorizar el cálculo)
  const isSearchDisabled = useMemo(() => {
    return searchTerm.length < MIN_LENGTH;
  }, [searchTerm]);

  // 4. Función para manejar los cambios en el input (usamos useCallback)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMinLengthError) {
      setIsMinLengthError(false); // Resetea el error si el usuario empieza a escribir
    }
    setSearchTerm(e.target.value);
  }, [isMinLengthError]);

  // 5. Función para manejar el click del botón de búsqueda (usamos useCallback)
  const handleSearch = useCallback(() => {
    if (isSearchDisabled) {
      setIsMinLengthError(true);// Si la búsqueda está deshabilitada (menos de 2 caracteres), mostramos el error
      setTimeout(() => {// Ocultamos el mensaje de error después del tiempo definido                            
        setIsMinLengthError(false);
      }, ERROR_DURATION_MS);
      return;
    } 

    onSearchTriggered(searchTerm);
     // **TODO:** Aquí debes agregar la lógica para navegar a la página de resultados 
      // o llamar a la API del backend.
  }, [isSearchDisabled, searchTerm, onSearchTriggered]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setIsMinLengthError(false);
  }, []);

  return {
    searchTerm,
    isSearchDisabled,
    isMinLengthError,
    handleInputChange,
    handleSearch,
    handleClearSearch,
  };
};