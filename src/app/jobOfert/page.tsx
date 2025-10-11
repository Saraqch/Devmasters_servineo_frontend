 "use client"; // 🔹 Obligatorio para usar useState y hooks

import { useState } from "react";
import { InputDemo } from "@/app/search/components/SearchBar";
import { SearchButton } from "@/app/search/components/SearchButton";
import Paginacion from "./components/Paginacion";
import CardJob from "./components/CardJob";

export default function JobOffers() {
  const [search, setSearch] = useState("");

  return (
    <main className="p-40">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Ofertas de trabajo
      </h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <InputDemo
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />
        <SearchButton />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <CardJob />
      </div>

      <div className="mt-6">
        <Paginacion />
      </div>
    </main>
  );
}
