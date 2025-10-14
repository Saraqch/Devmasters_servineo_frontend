'use client';

import React, { useState } from 'react'
import SearchBar from '@/Components/Offers/SearchBar'
import FilterBar, { type FilterBarValues } from '@/Components/Offers/FilterBar'
import OfferTable from '@/Components/Offers/OfferTable'
import type { OfferItem } from '@/Components/Offers/OfferList'
import Tabs from '@/Components/Tabs/Tabs'
import TabsList from '@/Components/Tabs/TabsList'
import TabsTrigger from '@/Components/Tabs/TabsTrigger'
import TabsContent from '@/Components/Tabs/TabsContent'

const JobOfferListPage = () => {
  const [activeTab, setActiveTab] = useState('offersJobs')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterBarValues>({ category: '', price: '', location: '', rating: '' })
  const [alphaRange, setAlphaRange] = useState<string>('')

  // Datos mock; reemplazar con datos de API cuando estén disponibles
  const items: OfferItem[] = [
    {
      id: '1',
      title: 'Reparación de grifo',
      description: 'Servicio de reparación y mantenimiento de grifos y llaves de agua',
      author: 'Juan Pérez',
      rating: 4.8,
      price: 150,
      tag: 'Fontanería',
      category: 'plomeria',
      location: 'La Paz',
    },
    {
      id: '2',
      title: 'Instalación eléctrica',
      description: 'Instalación y reparación de sistemas eléctricos residenciales',
      author: 'María García',
      rating: 4.9,
      price: 300,
      tag: 'Electricidad',
      category: 'electricidad',
      location: 'Cochabamba',
    },
    {
      id: '3',
      title: 'Albañilería general',
      description: 'Construcción y reparación de muros y estructuras',
      author: 'Carlos López',
      rating: 4.6,
      price: 220,
      tag: 'Albañilería',
      category: 'albanileria',
      location: 'Santa Cruz',
    },
     {
      id: '4',
      title: 'Reparación de grifo',
      description: 'Servicio de reparación y mantenimiento de grifos y llaves de agua',
      author: 'Juan Pérez',
      rating: 4.8,
      price: 150,
      tag: 'Fontanería',
      category: 'plomeria',
      location: 'La Paz',
    },
    {
      id: '5',
      title: 'Instalación eléctrica',
      description: 'Instalación y reparación de sistemas eléctricos residenciales',
      author: 'María García',
      rating: 4.9,
      price: 300,
      tag: 'Electricidad',
      category: 'electricidad',
      location: 'Cochabamba',
    },
    {
      id: '6',
      title: 'Albañilería general',
      description: 'Construcción y reparación de muros y estructuras',
      author: 'Carlos López',
      rating: 4.6,
      price: 220,
      tag: 'Albañilería',
      category: 'albanileria',
      location: 'Santa Cruz',
    },
  ]

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

              <OfferTable items={items} search={search} filters={filters} alphaRange={alphaRange} />
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
  )
}

export default JobOfferListPage