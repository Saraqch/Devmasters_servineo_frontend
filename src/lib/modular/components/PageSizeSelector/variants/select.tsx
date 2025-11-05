// src/lib/modular/components/PageSizeSelector/variants/select.tsx
'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageSizeSelectorProps } from '../PageSizeSelector';
import { registerPageSizeVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PageSizeSelectorSelect = React.forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ value, onChange, options = [10, 20, 50, 100], label = 'Mostrar', className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-muted-foreground">{label}:</span>
        <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">por página</span>
      </div>
    );
  },
);

PageSizeSelectorSelect.displayName = 'PageSizeSelectorSelect';

registerPageSizeVariant('select', PageSizeSelectorSelect);
