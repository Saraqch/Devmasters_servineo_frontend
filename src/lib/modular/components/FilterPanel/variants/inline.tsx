// src/lib/modular/components/FilterPanel/variants/inline.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useFilter } from '@/lib/modular/hooks';
import { FilterPanelHeadless } from '@/lib/modular/headless';
import { FilterPanelProps } from '../FilterPanel';
import { registerFilterVariant } from '../registry';
import { cn } from '@/lib/utils';

export const FilterPanelInline = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      config,
      initialFilters = {},
      onApply,
      autoApply = true,
      showResetButton = true,
      resetStructure,
      className,
    },
    ref,
  ) => {
    const filter = useFilter({
      initialFilters,
      autoApply,
      onApply,
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

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <FilterPanelHeadless
          filters={filter.filters}
          config={config}
          onChange={filter.updateFilter}
          onApply={filter.applyFilters}
          onReset={filter.reset}
          hasChanges={filter.hasChanges}
        >
          {({ filterGroups, actions }) => (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {filterGroups.map((group) => (
                  <div key={group.config.key} className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {group.config.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map(({ option, isSelected, toggle }) => (
                        <Button
                          key={option.value}
                          onClick={toggle}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          disabled={option.disabled}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {showResetButton && filter.hasActiveFilters && (
                <Button
                  onClick={actions.reset}
                  variant="ghost"
                  size="sm"
                  disabled={!filter.hasActiveFilters}
                >
                  <X size={14} className="mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </FilterPanelHeadless>
      </div>
    );
  },
);

FilterPanelInline.displayName = 'FilterPanelInline';

registerFilterVariant('inline', FilterPanelInline);
