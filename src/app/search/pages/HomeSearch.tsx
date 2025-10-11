"use client"; 

import { InputDemo } from "../components/SearchBar";
import { SearchButton } from "../components/SearchButton";
// Importa el hook usesearch
import { useSearch } from "../hooks/useSearch"; 

export default function HomeSearch() {
  // Llamada al hook para obtener la lógica y el estado
  const { 
    searchTerm, 
    isSearchDisabled, 
    handleInputChange, 
    handleSearch,
    handleClearSearch,
  } = useSearch();

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      
      <h1 style={{ marginBottom: 20, fontSize: "2.2rem", fontFamily: "Roboto, Arial, sans-serif", fontWeight: "bold",lineHeight: 0.8 }}>
        Encuentra el profesional perfecto
      </h1>
      <h2 style={{ marginBottom: 18, textAlign: "center", fontFamily: "Roboto, Arial, sans-serif", lineHeight: 0.05 }}>
        Conecta con expertos verificados. Más de 1000 
      </h2>
      <h2 style={{ marginBottom: 18, textAlign: "center", fontFamily: "Roboto, Arial, sans-serif", lineHeight: 0.5 }}>
        profesionales listos para ayudarte.
      </h2>
      
      <div
        style={{
          width: 780,
          display: "flex",
          alignItems: "flex-start",
          gap: 5,
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <InputDemo
            placeholder="¿Qué servicio necesitas?"
          />
        </div>
        <div style={{ marginTop: 1.5 }}>
          <SearchButton
            // Pasa la validación y el manejador de búsqueda del hook
            disabled={isSearchDisabled}
            onClick={handleSearch} 
            style={{
              backgroundColor: "#2B6AE0",
              color: "#fff",
              border: "none",
              padding: "10px 10px",
              borderRadius: "9px",
              cursor: isSearchDisabled ? 'not-allowed' : 'pointer', 
              paddingLeft: 10,
              paddingRight: 10,
              fontFamily: "Roboto, Arial, sans-serif",
            }}
          />
        </div>
      </div>
      
      {/* Indicador visual basado en el estado del hook */}
      {searchTerm.length > 0 && isSearchDisabled && (
          <p style={{ color: "#888", marginTop: '10px', fontSize: '0.8rem' }}>
              Mínimo 2 caracteres para buscar. 
          </p>
      )}
    </main>
  );
}
