import React from 'react'

export interface PaginationProps {
  page: number // 1-based
  pageCount: number
  onPageChange: (page: number) => void
}

const btnBase = 'px-3 py-1 rounded-md border text-sm';

const Pagination: React.FC<PaginationProps> = ({ page, pageCount, onPageChange }) => {
  if (pageCount <= 1) return null

  const go = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return
    onPageChange(p)
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-4" aria-label="Pagination">
      <button
        type="button"
        className={`${btnBase} ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Anterior"
      >
        «
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`${btnBase} ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className={`${btnBase} ${page === pageCount ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        aria-label="Siguiente"
      >
        »
      </button>
    </nav>
  )
}

export default Pagination
