import React from 'react'
import { Select } from '../Form'

export interface FilterBarValues {
  category: string
  price: string
  location: string
  rating: string
}

export interface FilterBarProps extends FilterBarValues {
  onChange: (values: FilterBarValues) => void
  categories?: { label: string; value: string }[]
  locations?: { label: string; value: string }[]
}

const defaultCategories = [
  { label: 'Todos', value: '' },
  { label: 'Electricidad', value: 'electricidad' },
  { label: 'Plomería', value: 'plomeria' },
  { label: 'Albañilería', value: 'albanileria' },
  { label: 'Pintura', value: 'pintura' },
]

const defaultLocations = [
  { label: 'Todas', value: '' },
  { label: 'La Paz', value: 'lapaz' },
  { label: 'Cochabamba', value: 'cochabamba' },
  { label: 'Santa Cruz', value: 'santacruz' },
]

const FilterBar: React.FC<FilterBarProps> = ({
  category,
  price,
  location,
  rating,
  onChange,
  categories = defaultCategories,
  locations = defaultLocations,
}) => {
  const set = (patch: Partial<FilterBarValues>) => onChange({ category, price, location, rating, ...patch })

  const wrap = (el: React.ReactNode, key: string) => (
    <div key={key} style={{ flex: 1, minWidth: 160 }}>
      {el}
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%' }}>
      {wrap(
        <Select value={category} onChange={(e) => set({ category: e.target.value })}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>,
        'category',
      )}

      {wrap(
        <Select value={price} onChange={(e) => set({ price: e.target.value })}>
          <option value="">Precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </Select>,
        'price',
      )}

      {wrap(
        <Select value={location} onChange={(e) => set({ location: e.target.value })}>
          {locations.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </Select>,
        'location',
      )}

      {wrap(
        <Select value={rating} onChange={(e) => set({ rating: e.target.value })}>
          <option value="">Rating</option>
          <option value="4">4+ estrellas</option>
          <option value="4.5">4.5+ estrellas</option>
          <option value="5">5 estrellas</option>
        </Select>,
        'rating',
      )}
    </div>
  )
}

export default FilterBar
