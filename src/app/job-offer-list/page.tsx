'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/Components/Offers/SearchBar';
import FilterBar, { type FilterBarValues } from '@/Components/Offers/FilterBar';
import Tabs from '@/Components/Tabs/Tabs';
import TabsList from '@/Components/Tabs/TabsList';
import TabsTrigger from '@/Components/Tabs/TabsTrigger';
import TabsContent from '@/Components/Tabs/TabsContent';
import type { OfferItem } from '@/Components/Offers/OfferList';
import { getJobs } from '@/service/serviceJobs';
import OfferTable from '@/components/Offers/OfferTable';

const JobOfferListPage = () => {
  const [activeTab, setActiveTab] = useState('offersJobs');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterBarValues>({
    category: '',
    price: '',
    location: '',
    rating: '',
  });
  const [alphaRange, setAlphaRange] = useState<string>('');
  const [items, setItems] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos desde el backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setItems(data); // guarda los datos recibidos
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Cargando ofertas...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Ofertas de Trabajo</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center">
          <TabsList className="flex mb-4 gap-[0.1px]">
            <TabsTrigger value="offersJobs">Offers Jobs</TabsTrigger>
            <TabsTrigger value="help">Ayuda</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-2">
          {/* Tabla de ofertas con filtros + paginación */}
          <TabsContent value="offersJobs" activeTab={activeTab}>
            <div style={{ display: 'grid', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FilterBar {...filters} onChange={setFilters} />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{ fontSize: 14, color: '#374151' }}>Rango A-Z</label>
                  <select
                    value={alphaRange}
                    onChange={(e) => setAlphaRange(e.target.value)}
                    className="rounded-full border-0 bg-gray-200 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="A-C">A-C</option>
                    <option value="D-F">D-F</option>
                    <option value="G-I">G-I</option>
                    <option value="J-L">J-L</option>
                    <option value="M-O">M-O</option>
                    <option value="P-R">P-R</option>
                    <option value="S-U">S-U</option>
                    <option value="V-Z">V-Z</option>
                  </select>
                </div>
              </div>

              <OfferTable
                items={items}
                search={search}
                filters={filters}
                alphaRange={alphaRange}
              />
            </div>
          </TabsContent>

          {/* Ayuda */}
          <TabsContent value="help" activeTab={activeTab}>
            <div className="rounded-xl border border-gray-300 bg-white p-6">
              <h2 className="text-lg font-semibold mb-2">Ayuda</h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Usa la búsqueda para encontrar ofertas por título, descripción o autor.</li>
                <li>Filtra por categoría, precio, ubicación y rating con la barra de filtros.</li>
                <li>Ajusta el rango alfabético A–Z para limitar por inicial del título.</li>
                <li>La tabla incluye paginación para navegar por los resultados.</li>
              </ul>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default JobOfferListPage;
