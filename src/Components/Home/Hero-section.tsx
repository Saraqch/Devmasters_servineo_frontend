"use client";
import { Search } from "lucide-react";

import { useState } from "react";
import StatCard from "../Common/StatCard";

export default function HeroSection() {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      console.log("Searching for:", searchText);
    }
  };

  return (
    <section className="relative w-full pt-28 pb-16 px-4 md:px-12 text-center bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-5" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_8s_ease-in-out_infinite] animation-delay-2000" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent drop-shadow-sm">
          Encuentra el profesional perfecto
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium">
          Conectamos tu hogar con expertos verificados en tu ciudad
        </p>

        <form onSubmit={handleSearch} className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
              placeholder="¿Qué servicio necesitas?"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <span className="font-semibold text-gray-700 text-lg">Búsquedas populares:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {["Plomero", "Electricista", "Pintor", "Carpintero"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchText(tag)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <StatCard number="1,000+" text="Profesionales" />
          <StatCard number="5,000+" text="Trabajos realizados" />
          <StatCard number="4.8★" text="Calificación promedio" />
        </div>
      </div>
    </section>
  );
}