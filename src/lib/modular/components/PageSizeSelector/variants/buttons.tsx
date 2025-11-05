// src/lib/modular/components/PageSizeSelector/variants/buttons.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PageSizeSelectorProps } from '../PageSizeSelector';
import { registerPageSizeVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PageSizeSelectorButtons = React.forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ value, onChange, options = [10, 20, 50, 100], label = 'Mostrar', className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-muted-foreground">{label}:</span>
        <div className="flex gap-1">
          {options.map((option) => (
            <Button
              key={option}
              onClick={() => onChange(option)}
              variant={value === option ? 'default' : 'outline'}
              size="sm"
              className="min-w-[40px]"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  },
);

PageSizeSelectorButtons.displayName = 'PageSizeSelectorButtons';

registerPageSizeVariant('buttons', PageSizeSelectorButtons);
