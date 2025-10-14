"use client";
import FixerRegisterForm, { type FormFieldConfig } from '@/Components/Form/FixerRegisterForm';
import NewOfferForm from './NewOfferForm';
import SearchBar from '@/Components/Offers/SearchBar'
import FilterBar, { type FilterBarValues } from '@/Components/Offers/FilterBar'
import OfferList, { type OfferItem } from '@/Components/Offers/OfferList'
import { useState } from 'react'
import Tabs from '@/Components/Tabs/Tabs';
import TabsList from '@/Components/Tabs/TabsList';
import TabsTrigger from '@/Components/Tabs/TabsTrigger';
import TabsContent from '@/Components/Tabs/TabsContent';

// Apply function that if you are not a fixer has the tab options you have to have them blocked
const registerFields: FormFieldConfig[] = [
  { id: 'fullName', label: 'Nombre completo', type: 'text', placeholder: 'Ej. Juan Pérez' },
  { id: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@correo.com' },
  { id: 'phone', label: 'Teléfono', type: 'phone', placeholder: 'Ej. +591 70000000' },
  {
    id: 'category',
    label: 'Categoría',
    type: 'select',
    placeholder: 'Selecciona una categoría',
    options: [
      { label: 'Plomería', value: 'plomeria' },
      { label: 'Electricidad', value: 'electricidad' },
      { label: 'Carpintería', value: 'carpinteria' },
      { label: 'Pintura', value: 'pintura' },
    ],
  },
  {
    id: 'city',
    label: 'Ciudad',
    type: 'select',
    placeholder: 'Selecciona tu ciudad',
    options: [
      { label: 'La Paz', value: 'la-paz' },
      { label: 'Cochabamba', value: 'cochabamba' },
      { label: 'Santa Cruz', value: 'santa-cruz' },
    ],
  },
  { id: 'idDocument', label: 'Documento de identidad', type: 'file', placeholder: 'Sube tu documento' },
]

const BecomeFixerPage = () => {
  const [activeTab, setActiveTab] = useState('register');
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterBarValues>({ category: '', price: '', location: '', rating: '' })


  const myOffers: OfferItem[] = [
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
  ]

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">LOGO</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center">
          <TabsList className="flex mb-4 gap-[0.1px]">
            <TabsTrigger value="register">Registro</TabsTrigger>
            <TabsTrigger value="newOffer">Nueva Oferta</TabsTrigger>
            <TabsTrigger value="myOffer">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="video">Video Inspeccion</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-2">
          <TabsContent value="register" activeTab={activeTab}>
            <FixerRegisterForm fields={registerFields} />
          </TabsContent>
          
          <TabsContent value="newOffer" activeTab={activeTab}>
            <NewOfferForm />
          </TabsContent>
          {/* edit and delete buttons for each offer */}
          <TabsContent value="myOffer" activeTab={activeTab}>
            <div style={{ display: 'grid', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} />
              <FilterBar {...filters} onChange={setFilters} />
              <OfferList items={myOffers} search={search} filters={filters} />
            </div>
          </TabsContent>
          
          <TabsContent value="map" activeTab={activeTab}>
            <p>section map</p>
          </TabsContent>
          
          <TabsContent value="video" activeTab={activeTab}>
            <p>section video</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BecomeFixerPage;