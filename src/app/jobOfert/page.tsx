 "use client"; // 🔹 Obligatorio para usar useState y hooks

import React, { useState, useEffect } from "react";
import { InputDemo } from "@/app/search/components/SearchBar";
import { FilterButton } from "./components/FilterButton";
import { SearchButton } from "@/app/search/components/SearchButton";
import { FilterDrawer } from "./components/FilterDrawer";
import Paginacion from "./components/Paginacion";
import CardJob from "./components/CardJob";
import { fetchServicios } from "@/lib/api";

interface Servicio {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  fixerName?: string;
  contacto?: string;
  whatsapp?: string;
  telefono?: string;
  tags?: string[];
  etiquetas?: string[];
}

export default function JobOffers() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);

  // Buscar servicios cuando cambia el texto de búsqueda
  useEffect(() => {
    setLoading(true);
    fetchServicios({ name: search, context: "" })
      .then((data) => setServicios(Array.isArray(data.data) ? data.data : []))
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));
  }, [search]);

  return ( 
  <>
    <main className="p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Ofertas de trabajo
      </h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <FilterButton 
          title="Filtrar resultados" 
          onClick={() => setShowFilters(!showFilters)}
        />
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />
        <SearchButton />
        <button
          className="ml-2 px-4 py-2 border rounded"
          onClick={() => setView(view === "list" ? "grid" : "list")}
        >
          {view === "list" ? "Ver en cuadrícula" : "Ver en lista"}
        </button>
      </div>

      <div className="text-center mb-4">
        <span className="font-semibold">{servicios.length}</span> ofertas encontradas
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <>
          <div className={view === "grid" ? "grid grid-cols-2 gap-4 justify-center" : "flex flex-col gap-4"}>
            {Array.isArray(servicios) &&
              servicios.map((servicio: Servicio) => (
                <div key={servicio.id || servicio._id} className="border rounded p-4 shadow">
                  <div className="font-bold">{servicio.title}</div>
                  <div>{servicio.description}</div>
                  <div>
                    <span className="font-semibold">Fixer:</span>{" "}
                    {servicio.fixerName || servicio.contacto}
                  </div>
                  <div>
                    <span className="font-semibold">WhatsApp:</span>{" "}
                    {servicio.whatsapp || servicio.telefono}
                  </div>
                  <div className="mt-2">
                    {(Array.isArray(servicio.tags)
                      ? servicio.tags
                      : Array.isArray(servicio.etiquetas)
                      ? servicio.etiquetas
                      : []
                    ).map((tag: string, idx: number) => (
                      <span
                        key={tag + idx}
                        className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <CardJob />
          </div>
        </>
      )}
      <div className="mt-6">
        <Paginacion />
      </div>
    </main>
    <FilterDrawer isOpen={showFilters} onClose={() => setShowFilters(false)} />
  </>
 );
}