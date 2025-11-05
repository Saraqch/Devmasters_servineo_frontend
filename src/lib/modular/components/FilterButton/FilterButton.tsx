// src/lib/modular/components/FilterButton/FilterButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
  iconSize?: number;
}

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      showText = false,
      text = 'Filtros',
      iconSize,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-9 h-9 sm:w-10 sm:h-10 p-2',
      lg: 'w-10 h-10 sm:w-12 sm:h-12 p-2.5',
    };

    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    const variantClasses = {
      default:
        'bg-[#f7f7f7] hover:bg-white text-black border border-black shadow-lg hover:shadow-xl',
      outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg transition-all',
          !showText && sizeClasses[size],
          showText && 'px-4 py-2',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        <SlidersHorizontal size={iconSize || iconSizes[size]} />
        {showText && <span className="font-medium text-sm">{text}</span>}
      </Button>
    );
  },
);

FilterButton.displayName = 'FilterButton';
