// src/lib/modular/components/FilterPanel/variants/sidebar.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useFilter } from '@/lib/modular/hooks';
import { FilterPanelHeadless } from '@/lib/modular/headless';
import { FilterPanelProps } from '../FilterPanel';
import { registerFilterVariant } from '../registry';
import { cn } from '@/lib/utils';

export const FilterPanelSidebar = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      config,
      initialFilters = {},
      onApply,
      onClose,
      autoApply = false, // Sidebar usa botón Aplicar por defecto
      closeOnApply = false,
      showApplyButton = true,
      showResetButton = true,
      resetStructure,
      className,
    },
    ref,
  ) => {
    const filter = useFilter({
      initialFilters,
      autoApply,
      onApply: (filters) => {
        setTimeout(() => {
          onApply?.(filters);
          if (closeOnApply) onClose?.();
        }, 0);
      },
      defaultOpenSections: config.map((c) => c.key), // Todas abiertas por defecto
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

    const shouldShowApplyButton = showApplyButton && !autoApply;

    return (
      <div
        ref={ref}
        className={cn(
          'w-full sm:w-80 max-h-[80vh] overflow-y-auto bg-white border border-gray-200 rounded-lg p-4 shadow-lg',
          className,
        )}
      >
        <FilterPanelHeadless
          filters={filter.filters}
          config={config}
          openSections={filter.openSections}
          onChange={filter.updateFilter}
          onToggleSection={filter.toggleSection}
          onApply={filter.applyFilters}
          onReset={filter.reset}
          hasChanges={filter.hasChanges}
        >
          {({ filterGroups, actions }) => (
            <>
              {filterGroups.map((group) => (
                <div key={group.config.key} className="space-y-3 mb-4">
                  <h3 className="font-semibold text-sm text-foreground">{group.config.label}</h3>
                  <div className="space-y-2">
                    {group.options.map(({ option, isSelected, toggle }) => (
                      <label
                        key={option.value}
                        className={cn(
                          'flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={toggle}
                          disabled={option.disabled}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {(shouldShowApplyButton || showResetButton) && (
                <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
                  {showResetButton && (
                    <Button
                      onClick={actions.reset}
                      variant="outline"
                      className="flex-1"
                      disabled={!filter.hasActiveFilters}
                    >
                      <X size={16} className="mr-2" />
                      Limpiar
                    </Button>
                  )}
                  {shouldShowApplyButton && (
                    <Button
                      onClick={() => {
                        actions.apply();
                        if (closeOnApply) onClose?.();
                      }}
                      disabled={!actions.canApply}
                      className="flex-1"
                    >
                      Aplicar
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </FilterPanelHeadless>
      </div>
    );
  },
);

FilterPanelSidebar.displayName = 'FilterPanelSidebar';

registerFilterVariant('sidebar', FilterPanelSidebar);
