// src/lib/modular/components/index.ts

// ============================================================================
// SEARCH BOX
// ============================================================================
export { SearchBox } from './SearchBox/SearchBox';
export type { SearchBoxProps } from './SearchBox/SearchBox';
export { 
  SearchBoxDefault,
  SearchBoxMinimal,
  SearchBoxCompact 
} from './SearchBox';
export type { SearchBoxVariantName } from './SearchBox/registry';

// ============================================================================
// FILTER DRAWER
// ============================================================================
export { FilterPanel} from './FilterPanel/FilterPanel';
export type { FilterPanelProps } from './FilterPanel/FilterPanel';
export {
  FilterPanelSidebar,
  FilterPanelDropdown,
  FilterPanelInline
} from './FilterPanel';
export type { FilterPanelVariantName } from './FilterPanel/registry';
// ============================================================================
// FILTER BUTTON / DRAWER
// ============================================================================
export { FilterButton } from './FilterButton/FilterButton';

// ============================================================================
// PAGINATION
// ============================================================================
export { Pagination } from './Pagination/Pagination';
export type { PaginationProps } from './Pagination/Pagination';
export {
  PaginationDefault,
  PaginationSimple,
  PaginationCompact
} from './Pagination';
export type { PaginationVariantName } from './Pagination/registry';

// ============================================================================
// PAGE SIZE SELECTOR
// ============================================================================
export { PageSizeSelector } from './PageSizeSelector/PageSizeSelector';
export type { PageSizeSelectorProps } from './PageSizeSelector/PageSizeSelector';
export {
  PageSizeSelectorSelect,
  PageSizeSelectorButtons,
  PageSizeSelectorHeadlessUI,
  PageSizeSelectorCompact
} from './PageSizeSelector';
export type { PageSizeSelectorVariantName } from './PageSizeSelector/registry';

// ============================================================================
// SORT SELECT
// ============================================================================
export { SortSelect } from './SortSelect/SortSelect';
export type { SortSelectProps } from './SortSelect/SortSelect';
export {
  SortSelectDropdown,
  SortSelectSelect,
  SortSelectButtonGroup,
  SortSelectCard
} from './SortSelect';
export type { SortSelectVariantName } from './SortSelect/registry';