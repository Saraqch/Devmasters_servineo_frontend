// src/app/jobOfert/components_jo/Pagination/PaginationSelector.tsx
'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface PaginationSelectorProps {
  registrosPorPagina: number;
  onChange: (valor: number) => void;
}

const PaginationSelector: React.FC<PaginationSelectorProps> = ({
  registrosPorPagina,
  onChange,
}) => {
  const opciones = [10, 20, 50, 100];

  return (
    // 🎨 Diseño específico de JobOfert (usa Headless UI directamente)
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-gray-600">Mostrar:</span>
      <Listbox value={registrosPorPagina} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-20 cursor-pointer border border-gray-300 rounded-lg bg-white px-2 py-1 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {registrosPorPagina}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown size={16} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              {opciones.map((opcion) => (
                <Listbox.Option
                  key={opcion}
                  value={opcion}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-blue-600 text-white' : 'text-black'
                    } ${selected ? 'font-bold' : ''}`
                  }
                >
                  {opcion}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <span className="text-sm text-gray-600">por página</span>
    </div>
  );
};

export default PaginationSelector;
