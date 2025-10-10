"use client";
import React, { useState, useEffect } from "react";
import { FilterButton } from "../components/FilterButton";
import { SearchButton } from "../components/SearchButton";
import { FilterDrawer } from "../components/FilterDrawer";
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

export default function JobOffersPage() {
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
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Ofertas de Trabajo</h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className="p-2"
            title="Filtrar resultados"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterButton />
          </button>
          <input
            type="text"
            placeholder="Buscar oferta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-1/2"
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
          <div className={view === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
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
        )}
      </div>
      <FilterDrawer isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </>
  );
}