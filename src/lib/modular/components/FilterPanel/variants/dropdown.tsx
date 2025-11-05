// src/lib/modular/components/FilterPanel/variants/dropdown.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';
import { useFilter } from '@/lib/modular/hooks';
import { FilterPanelHeadless } from '@/lib/modular/headless';
import { FilterPanelProps } from '../FilterPanel';
import { registerFilterVariant } from '../registry';
import { cn } from '@/lib/utils';

export const FilterPanelDropdown = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      config,
      initialFilters = {},
      onApply,
      autoApply = false,
      showResetButton = true,
      resetStructure,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const filter = useFilter({
      initialFilters,
      autoApply,
      onApply: (filters) => {
        onApply?.(filters);
        if (!autoApply) setOpen(false);
      },
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

    const shouldShowApplyButton = !autoApply;

    return (
      <div ref={ref} className={cn('', className)}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filtros
              {filter.hasActiveFilters && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {
                    Object.values(filter.filters).filter((v) =>
                      Array.isArray(v) ? v.length > 0 : v,
                    ).length
                  }
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-80 max-h-[500px] overflow-y-auto">
            <div className="p-4">
              <FilterPanelHeadless
                filters={filter.filters}
                config={config}
                onChange={filter.updateFilter}
                onApply={filter.applyFilters}
                onReset={filter.reset}
                hasChanges={filter.hasChanges}
              >
                {({ filterGroups, actions }) => (
                  <>
                    {filterGroups.map((group) => (
                      <div key={group.config.key} className="space-y-2 mb-4">
                        <h4 className="font-medium text-sm">{group.config.label}</h4>
                        <div className="space-y-1">
                          {group.options.map(({ option, isSelected, toggle }) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={toggle}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {(shouldShowApplyButton || showResetButton) && (
                      <div className="flex gap-2 pt-3 border-t">
                        {showResetButton && (
                          <Button
                            onClick={actions.reset}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={!filter.hasActiveFilters}
                          >
                            <X size={14} className="mr-1" />
                            Limpiar
                          </Button>
                        )}
                        {shouldShowApplyButton && (
                          <Button
                            onClick={actions.apply}
                            disabled={!actions.canApply}
                            size="sm"
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);

FilterPanelDropdown.displayName = 'FilterPanelDropdown';

registerFilterVariant('dropdown', FilterPanelDropdown);
