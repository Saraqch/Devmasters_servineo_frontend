// src/app/redux/features/searchHistory/useSearchKeyboard.ts
import { useCallback } from 'react';

interface UseSearchKeyboardOptions {
  isOpen: boolean;
  highlighted: number;
  combinedItems: string[];
  onSelect: (item: string) => void;
  onSearch: () => void;
  onClose: () => void;
  setHighlighted: React.Dispatch<React.SetStateAction<number>>;
  setPreviewValue?: (value: string | null) => void;
  enablePreview?: boolean;
}

/**
 * Hook para manejar la navegación por teclado en el search
 * Soporta: Enter, ArrowUp, ArrowDown, Escape
 */
export function useSearchKeyboard(options: UseSearchKeyboardOptions) {
  const {
    isOpen,
    highlighted,
    combinedItems,
    onSelect,
    onSearch,
    onClose,
    setHighlighted,
    setPreviewValue,
    enablePreview = true,
  } = options;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // ENTER
      if (e.key === 'Enter') {
        e.preventDefault();

        // Si hay un item resaltado, seleccionarlo
        if (isOpen && highlighted >= 0 && highlighted < combinedItems.length) {
          const item = combinedItems[highlighted];
          onSelect(item);
          return;
        }

        // Si no, hacer búsqueda normal
        onSearch();
        return;
      }

      // ARROW DOWN
      if (e.key === 'ArrowDown') {
        e.preventDefault();

        setHighlighted((prev) => {
          const max = combinedItems.length - 1;
          const next = prev < max ? prev + 1 : 0;

          // Preview en desktop
          if (enablePreview && setPreviewValue && combinedItems[next]) {
            setPreviewValue(combinedItems[next]);
          }

          return next;
        });
        return;
      }

      // ARROW UP
      if (e.key === 'ArrowUp') {
        e.preventDefault();

        setHighlighted((prev) => {
          const max = combinedItems.length - 1;
          const next = prev > 0 ? prev - 1 : Math.max(0, max);

          // Preview en desktop
          if (enablePreview && setPreviewValue && combinedItems[next]) {
            setPreviewValue(combinedItems[next]);
          }

          return next;
        });
        return;
      }

      // ESCAPE
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        if (setPreviewValue) {
          setPreviewValue(null);
        }
        return;
      }
    },
    [
      isOpen,
      highlighted,
      combinedItems,
      onSelect,
      onSearch,
      onClose,
      setHighlighted,
      setPreviewValue,
      enablePreview,
    ],
  );

  return { handleKeyDown };
}
