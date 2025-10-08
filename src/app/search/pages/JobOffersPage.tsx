import React, { useState } from "react";
import { SearchButton } from "../components/SearchButton";

const mockJobOffers = [
  {
    id: 1,
    description: "Reparación de lavadora",
    fixerName: "Juan Pérez",
    whatsapp: "+591 71234567",
    tags: ["Electrodomésticos", "Urgente"],
    addedAt: "2025-10-08T10:00:00Z",
  },
  {
    id: 2,
    description: "Instalación de lámparas LED",
    fixerName: "María López",
    whatsapp: "+591 78901234",
    tags: ["Electricidad", "LED"],
    addedAt: "2025-10-07T15:30:00Z",
  },
  // ...más ofertas simuladas
];

export default function JobOffersPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const filteredOffers = mockJobOffers
    .filter((offer) =>
      offer.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Ofertas de Trabajo</h1>
      <div className="flex items-center justify-center gap-4 mb-4">
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
        <span className="font-semibold">{filteredOffers.length}</span> ofertas encontradas
      </div>
      <div className={view === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="border rounded p-4 shadow">
            <div className="font-bold">{offer.description}</div>
            <div>
              <span className="font-semibold">Fixer:</span> {offer.fixerName}
            </div>
            <div>
              <span className="font-semibold">WhatsApp:</span> {offer.whatsapp}
            </div>
            <div className="mt-2">
              {offer.tags.map((tag) => (
                <span key={tag} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Aquí podrías agregar paginación o scroll infinito */}
    </div>
  );
}