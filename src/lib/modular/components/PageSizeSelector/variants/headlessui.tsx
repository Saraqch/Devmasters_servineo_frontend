// src/lib/modular/components/PageSizeSelector/variants/headlessui.tsx
'use client';

import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { PageSizeSelectorProps } from '../PageSizeSelector';
import { registerPageSizeVariant } from '../registry';
import { cn } from '@/lib/utils';

export const PageSizeSelectorHeadlessUI = React.forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ value, onChange, options = [10, 20, 50, 100], label = 'Mostrar', className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-muted-foreground">{label}:</span>
        <Listbox value={value} onChange={onChange}>
          <div className="relative">
            <Listbox.Button className="relative w-20 cursor-pointer border border-input rounded-md bg-background px-3 py-2 text-left text-sm shadow-sm hover:bg-accent/50 transition-colors">
              {value}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown size={16} className="text-muted-foreground" />
              </span>
            </Listbox.Button>

            <Transition
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover border shadow-lg focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    className={({ active, selected }) =>
                      cn(
                        'cursor-pointer select-none px-3 py-2 text-sm',
                        active && 'bg-accent',
                        selected && 'font-semibold',
                      )
                    }
                  >
                    {option}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <span className="text-sm text-muted-foreground">por página</span>
      </div>
    );
  },
);

PageSizeSelectorHeadlessUI.displayName = 'PageSizeSelectorHeadlessUI';

registerPageSizeVariant('headlessui', PageSizeSelectorHeadlessUI);
