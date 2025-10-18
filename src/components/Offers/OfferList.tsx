import React, { useMemo } from 'react'
import OfferCard from './OfferCard'
import type { FilterBarValues } from './FilterBar'

export interface OfferItem {
  id: string
  title: string
  description: string
  author: string
  rating: number
  price: number
  tag: string
  category: string
  location?: string
}

export interface OfferListProps {
  items: OfferItem[]
  search: string
  filters: FilterBarValues
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const OfferList: React.FC<OfferListProps> = ({ items, search, filters, onEdit, onDelete }) => {
  const data = useMemo(() => {
    let res = items

    if (search) {
      const q = search.toLowerCase()
      res = res.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.author.toLowerCase().includes(q),
      )
    }

    if (filters.category) res = res.filter((i) => i.category === filters.category)
    if (filters.location) res = res.filter((i) => (i.location || '').toLowerCase().includes(filters.location))

    if (filters.rating) {
      const min = parseFloat(filters.rating)
      res = res.filter((i) => i.rating >= min)
    }

    if (filters.price === 'asc') res = [...res].sort((a, b) => a.price - b.price)
    if (filters.price === 'desc') res = [...res].sort((a, b) => b.price - a.price)

    return res
  }, [items, search, filters])

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {data.map((o) => (
        <OfferCard key={o.id} {...o} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default OfferList
