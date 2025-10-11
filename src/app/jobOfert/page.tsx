import { SearchButton } from "@/app/search/components/SearchButton";
import Paginacion from "./components/Paginacion";
import { InputDemo } from "@/app/search/components/SearchBar";
import CardJob from "./components/CardJob";

export default function JobOffers() {
  return (
    <main className="p-40">
      {/* Título centrado */}
      <h1 className="mb-4 text-center text-3xl font-bold">
        Ofertas de trabajo
      </h1>

      {/* Barra de búsqueda y botón centrados */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <InputDemo placeholder="Buscar ofertas de trabajo" />
        <SearchButton />
      </div>

      {/* Cards de ofertas */}
      <div className="flex flex-wrap gap-4 justify-center">
        <CardJob />
      </div>

      {/* Paginación */}
      <div className="mt-6">
        <Paginacion />
      </div>
    </main>
  );
}