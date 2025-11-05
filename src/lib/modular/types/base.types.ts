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
  label: string;
  value: any;
  disabled?: boolean;
}

export type FilterType = 
  | 'checkbox-multi'
  | 'checkbox-single'
  | 'checkbox';

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  columns?: 1 | 2 | 3 | 4;
  defaultOpen?: boolean;
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