// src/app/redux/features/searchHistory/useSearchTouch.ts
import { useRef, useCallback } from 'react';

interface UseSearchTouchReturn {
  handleTouchStart: (item: string) => () => void;
  handleTouchEnd: () => void;
  handlePointerDown: (item: string) => (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  clearTouchTimer: () => void;
}

/**
 * Hook para manejar gestos de pulsación larga (long press) en móvil
 * Soporta tanto touch como pointer events
 */
export function useSearchTouch(
  onLongPress: (item: string) => void,
  longPressDelay: number = 600
): UseSearchTouchReturn {
  const touchTimerRef = useRef<number | null>(null);

  const clearTouchTimer = useCallback(() => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (item: string) => () => {
      clearTouchTimer();
      touchTimerRef.current = window.setTimeout(() => {
        onLongPress(item);
      }, longPressDelay);
    },
    [onLongPress, longPressDelay, clearTouchTimer]
  );

  const handleTouchEnd = useCallback(() => {
    clearTouchTimer();
  }, [clearTouchTimer]);

  const handlePointerDown = useCallback(
    (item: string) => (e: React.PointerEvent) => {
      // Solo activar en eventos no-mouse (touch, pen)
      if (e.pointerType === 'mouse') return;
      
      clearTouchTimer();
      touchTimerRef.current = window.setTimeout(() => {
        onLongPress(item);
      }, longPressDelay);
    },
    [onLongPress, longPressDelay, clearTouchTimer]
  );

  const handlePointerUp = useCallback(() => {
    clearTouchTimer();
  }, [clearTouchTimer]);

  return {
    handleTouchStart,
    handleTouchEnd,
    handlePointerDown,
    handlePointerUp,
    clearTouchTimer,
  };
}