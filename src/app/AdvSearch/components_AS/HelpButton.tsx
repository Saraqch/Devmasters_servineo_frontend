
"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

export function HelpButton() {
  const handleClick = () => {
    console.log('Ayuda clickeada');
    // Aquí puedes agregar la lógica para mostrar ayuda
    // Por ejemplo: abrir un modal, redirigir a /ayuda, etc.
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-4 sm:right-6 top-20 lg:top-24 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      aria-label="Ayuda"
      title="Ayuda"
    >
      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}