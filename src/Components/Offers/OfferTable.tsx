import React, { useMemo, useState } from 'react'
import type { OfferItem } from './OfferList'
import type { FilterBarValues } from './FilterBar'
import Pagination from '@/Components/Shared/Pagination'

export interface OfferTableProps {
  items: OfferItem[]
  search: string
  filters: FilterBarValues
  alphaRange?: string // e.g. 'A-C', 'D-F', '' (all)
  pageSize?: number
}

const ranges: Record<string, [string, string]> = {
  'A-C': ['A', 'C'],
  'D-F': ['D', 'F'],
  'G-I': ['G', 'I'],
  'J-L': ['J', 'L'],
  'M-O': ['M', 'O'],
  'P-R': ['P', 'R'],
  'S-U': ['S', 'U'],
  'V-Z': ['V', 'Z'],
}

function inAlphaRange(title: string, range?: string) {
  if (!range || !(range in ranges)) return true
  const first = (title.trim()[0] || '').toUpperCase()
  const [a, b] = ranges[range]
  return first >= a && first <= b
}

const th = 'px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b'
const td = 'px-3 py-2 text-sm text-gray-800 border-b'

const OfferTable: React.FC<OfferTableProps> = ({ items, search, filters, alphaRange, pageSize = 5 }) => {
  const filtered = useMemo(() => {
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

    // Extra: filtro por rango alfabético en el título
    res = res.filter((i) => inAlphaRange(i.title, alphaRange))

    return res
  }, [items, search, filters, alphaRange])

  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  // Reset page if filters change and page overflow
  React.useEffect(() => {
    setPage(1)
  }, [search, filters, alphaRange, pageSize])

  return (
    <div className="w-full">
      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className={th}>Título</th>
              <th className={th}>Descripción</th>
              <th className={th}>Autor</th>
              <th className={th}>Rating</th>
              <th className={th}>Precio</th>
              <th className={th}>Categoría</th>
              <th className={th}>Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className={td}>{o.title}</td>
                <td className={td}>{o.description}</td>
                <td className={td}>{o.author}</td>
                <td className={td}>{o.rating.toFixed(1)}</td>
                <td className={td}>${o.price}</td>
                <td className={td}>{o.tag}</td>
                <td className={td}>{o.location || '-'}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-sm text-gray-500" colSpan={7}>
                  No hay resultados con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}

export default OfferTable
