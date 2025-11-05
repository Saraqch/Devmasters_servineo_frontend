// src/lib/modular/components/PageSizeSelector/variants/compact.tsx
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

export const PageSizeSelectorCompact = React.forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ value, onChange, options = [10, 20, 50, 100], className }, ref) => {
    return (
      <div ref={ref} className={cn('inline-flex items-center', className)}>
        <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
          <SelectTrigger className="w-[70px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={String(option)} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

PageSizeSelectorCompact.displayName = 'PageSizeSelectorCompact';

registerPageSizeVariant('compact', PageSizeSelectorCompact);
