// src/lib/modular/FilterPanel.tsx
import React from 'react';
import { getFilterVariant, FilterPanelVariantName } from './registry';
import { FilterConfig } from '@/lib/modular/types/base.types';
import { cn } from '@/lib/utils';

export interface FilterPanelProps<T = any> {
  config: FilterConfig[];
  initialFilters?: T;
  onApply?: (filters: T) => void;
  onClose?: () => void;
  autoApply?: boolean;
  closeOnApply?: boolean;
  variant?: FilterPanelVariantName;
  showApplyButton?: boolean;
  showResetButton?: boolean;
  className?: string;

  // Props para drawer
  isOpen?: boolean;
  showOverlay?: boolean;
  drawerWidth?: string;
  drawerPosition?: 'left' | 'right';
  resetStructure?: Partial<T>;
}

export const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      variant = 'sidebar',
      isOpen = false,
      showOverlay = true,
      drawerWidth = '85%',
      drawerPosition = 'left',
      onClose,
      resetStructure,
      ...props
    },
    ref,
  ) => {
    const Component = getFilterVariant(variant);

    if (!Component) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`FilterPanel: variant "${variant}" no está registrado.`);
      }
      return null;
    }

    // ✅ Generar clase de ancho base
    const baseWidthClass = drawerWidth.includes('%') ? `w-[${drawerWidth}]` : `w-[${drawerWidth}]`;

    // Si es variante drawer y tiene isOpen, renderizamos con overlay
    if (variant === 'drawer' && isOpen !== undefined) {
      return (
        <>
          {/* Overlay */}
          {showOverlay && isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={onClose}
              aria-hidden="true"
            />
          )}

          {/* Drawer Panel */}
          {isOpen && (
            <div
              className={cn(
                'fixed top-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden',
                drawerPosition === 'left' ? 'left-0' : 'right-0',
                baseWidthClass,
                'max-w-full', // ✅ Asegurar que nunca exceda el viewport
                props.className, // ✅ Permitir clases responsivas personalizadas
              )}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-drawer-title"
            >
              <Component {...props} onClose={onClose} resetStructure={resetStructure} ref={ref} />
            </div>
          )}
        </>
      );
    }

    // Para otras variantes o drawer sin isOpen, renderizado normal
    return <Component {...props} onClose={onClose} resetStructure={resetStructure} ref={ref} />;
  },
);

FilterPanel.displayName = 'FilterPanel';
