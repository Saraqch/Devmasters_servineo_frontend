import React from 'react'

export interface OfferCardProps {
  id: string
  title: string
  description: string
  author: string
  rating: number
  price: number
  tag: string
  location?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const chipStyle: React.CSSProperties = {
  padding: '2px 8px',
  borderRadius: 9999,
  background: '#e0f2fe',
  color: '#0369a1',
  fontSize: 12,
  fontWeight: 600,
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 10px',
  borderRadius: 9999,
  border: '1px solid #e5e7eb',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
}

const dangerButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#ef4444',
  color: '#fff',
  borderColor: '#ef4444',
}

const OfferCard: React.FC<OfferCardProps> = ({
  id,
  title,
  description,
  author,
  rating,
  price,
  tag,
  location,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{title}</h3>
          <p style={{ margin: '4px 0 8px 0', color: '#4b5563', fontSize: 14 }}>{description}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#6b7280', fontSize: 13 }}>
            <span>Por: {author}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.87 1.401-8.168L.132 9.211l8.2-1.193z"/></svg>
              {rating.toFixed(1)}
            </span>
            {location ? <span>{location}</span> : null}
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontWeight: 700, color: '#111827' }}>${price}</div>
          <div style={{ marginTop: 8, display: 'inline-block', ...chipStyle }}>{tag}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {onEdit ? (
          <button type="button" style={buttonStyle} onClick={() => onEdit(id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Editar
          </button>
        ) : null}
        {onDelete ? (
          <button type="button" style={dangerButtonStyle} onClick={() => onDelete(id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            Eliminar
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default OfferCard
