// src/lib/modular/components/FilterPanel/variants/drawer.tsx
'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilter } from '@/lib/modular/hooks';
import { FilterPanelHeadless } from '@/lib/modular/headless';
import { FilterPanelProps } from '../FilterPanel';
import { registerFilterVariant } from '../registry';
import { cn } from '@/lib/utils';

export const FilterPanelDrawer = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      config,
      initialFilters = {},
      onApply,
      onClose,
      autoApply = true,
      closeOnApply = false,
      showResetButton = true,
      resetStructure,
      className,
    },
    ref,
  ) => {
    // ✅ Usar useFilter con resetStructure para mejor control
    const {
      filters,
      appliedFilters,
      openSections,
      updateFilter,
      applyFilters,
      reset,
      toggleSection,
      hasChanges,
      hasActiveFilters,
    } = useFilter({
      initialFilters,
      autoApply,
      onApply,
      defaultOpenSections: config.filter((c) => c.defaultOpen).map((c) => c.key),
      // ✅ Usar resetStructure si se proporciona, sino inferir de la configuración
      resetStructure:
        resetStructure ||
        config.reduce((acc, filterConfig) => {
          const isMulti =
            filterConfig.type === 'checkbox-multi' || filterConfig.type === 'checkbox';
          return {
            ...acc,
            [filterConfig.key]: isMulti ? [] : undefined,
          };
        }, {}),
    });

    // Prevenir scroll del body cuando el drawer está abierto
    // useEffect(() => {
    //   document.body.style.overflow = 'hidden';
    //   return () => {
    //     document.body.style.overflow = 'unset';
    //   };
    // }, []);

    // Auto-cerrar cuando se aplican filtros (si está configurado)
    useEffect(() => {
      if (closeOnApply && autoApply && hasActiveFilters && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [closeOnApply, autoApply, hasActiveFilters, onClose]);

    const getGridClass = (columns: number) => {
      const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
      };
      return gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-1';
    };

    const handleReset = () => {
      // ✅ Ahora reset() usa automáticamente la estructura correcta
      reset();

      // Si autoApply está desactivado y closeOnApply está activado, cerrar después de reset
      if (!autoApply && closeOnApply && onClose) {
        setTimeout(() => onClose(), 300);
      }
    };

    const handleApply = () => {
      if (!autoApply) {
        applyFilters();
      }
      if (closeOnApply && onClose) {
        setTimeout(() => onClose(), 200);
      }
    };

    return (
      <div ref={ref} className={cn('w-full h-full flex flex-col bg-white', className)}>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>

        <FilterPanelHeadless
          filters={filters}
          config={config}
          openSections={openSections}
          onChange={updateFilter}
          onToggleSection={toggleSection}
          onApply={applyFilters}
          onReset={reset}
          hasChanges={hasChanges}
        >
          {({ filterGroups, actions }) => (
            <>
              {/* Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
                <h2 id="filter-drawer-title" className="text-base sm:text-lg font-bold">
                  Filtros
                </h2>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {showResetButton && (
                    <Button
                      onClick={handleReset}
                      className="bg-[#2B6AE0] hover:bg-[#2B31E0] text-white px-3 sm:px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      disabled={!hasActiveFilters}
                    >
                      Resetear
                    </Button>
                  )}

                  {/* <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 p-2 transition-colors flex-shrink-0"
                    aria-label="Cerrar filtros"
                  >
                    <X size={24} />
                  </button> */}
                </div>
              </div>

              {/* Filter Groups */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                {filterGroups.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No hay filtros configurados</div>
                ) : (
                  filterGroups.map((group) => (
                    <div key={group.config.key} className="mb-6">
                      {/* Group Header */}
                      <button
                        onClick={() => actions.toggleSection(group.config.key)}
                        className="w-full bg-[#2B6AE0] hover:bg-[#2B31E0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer transition-colors flex items-center justify-between rounded"
                        aria-controls={`filter-group-${group.config.key}`}
                      >
                        <span className="truncate">{group.config.label}</span>
                        {group.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {/* Group Options */}
                      {group.isOpen && (
                        <div
                          id={`filter-group-${group.config.key}`}
                          className="bg-white border border-gray-200 p-4 rounded max-h-[300px] overflow-y-auto custom-scrollbar"
                        >
                          {group.options.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-4">
                              No hay opciones disponibles
                            </div>
                          ) : (
                            <div className={cn('grid gap-3', getGridClass(group.columns))}>
                              {group.options.map(({ option, isSelected, toggle }) => (
                                <label
                                  key={option.value}
                                  className={cn(
                                    'flex items-start gap-2 text-sm cursor-pointer transition-colors',
                                    option.disabled
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:text-[#2B31E0]',
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={toggle}
                                    disabled={option.disabled}
                                    className="w-4 h-4 cursor-pointer flex-shrink-0 mt-0.5 accent-[#2B6AE0]"
                                    aria-label={option.label}
                                  />
                                  <span className="break-words">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer con botón Apply (solo si autoApply está desactivado) */}
              {!autoApply && (
                <div className="border-t p-4 sm:p-6">
                  <Button
                    onClick={handleApply}
                    disabled={!actions.canApply}
                    className="w-full bg-[#2B6AE0] hover:bg-[#2B31E0] text-white py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actions.canApply ? 'Aplicar Filtros' : 'Sin cambios'}
                  </Button>
                </div>
              )}
            </>
          )}
        </FilterPanelHeadless>
      </div>
    );
  },
);

FilterPanelDrawer.displayName = 'FilterPanelDrawer';

registerFilterVariant('drawer', FilterPanelDrawer);
