'use client';

import React from 'react';

interface ButtonAplicarBusProps {
  onClick: () => void;
  loading?: boolean;
}

const ButtonAplicarBus: React.FC<ButtonAplicarBusProps> = ({ onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      } text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md`}
    >
      {loading ? 'Buscando...' : 'Aplicar Búsqueda'}
    </button>
  );
};

export default ButtonAplicarBus;
