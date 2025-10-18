import React from 'react'
import { Input } from '../Form'

export interface SearchBarProps {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder = 'Buscar servicios...', onChange }) => {
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: 36, borderRadius: 9999 }}
        />
      </div>
    </div>
  )
}

export default SearchBar
