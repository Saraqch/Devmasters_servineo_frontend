// src/lib/modular/types/base.types.ts
export interface BaseItem {
  _id: string;
  [key: string]: any;
}

export interface SearchConfig {
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  regex?: RegExp;
  debounceMs?: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'select' | 'range';
  options?: FilterOption[];
  multiple?: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface PaginationConfig {
  defaultPageSize: number;
  pageSizeOptions: number[];
  showInfo?: boolean;
}