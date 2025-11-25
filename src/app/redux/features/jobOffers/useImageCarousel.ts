// src/hooks/useImageCarousel.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useImageCarousel = (id: string, totalImages: number) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // 🆕 Estado de visibilidad
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null); // 🆕 Ref del elemento
  
  // Estados para touch/swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isTouching, setIsTouching] = useState(false);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 🆕 Iniciar carrusel automático
  const startCarousel = useCallback(() => {
    if (totalImages > 1) {
      clearCurrentInterval();
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
      }, 2000);
    }
  }, [totalImages, clearCurrentInterval]);

  // Desktop: Mouse hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    startCarousel();
  }, [startCarousel]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    clearCurrentInterval();
    setCurrentIndex(0);
  }, [clearCurrentInterval]);

  // Navegación manual
  const handlePrevImage = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      clearCurrentInterval();
      setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    },
    [totalImages, clearCurrentInterval]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      clearCurrentInterval();
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    },
    [totalImages, clearCurrentInterval]
  );

  // Touch handlers para swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsTouching(true);
    clearCurrentInterval();
  }, [clearCurrentInterval]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    }
  }, [totalImages]);

  // 🆕 Intersection Observer para mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    
    if (!isMobile || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          
          // Si la card está visible (>50% en pantalla), activar carrusel
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            startCarousel();
          } else {
            clearCurrentInterval();
            setCurrentIndex(0);
          }
        });
      },
      {
        threshold: [0, 0.5, 1], // Detectar cuando esté 50% visible
        rootMargin: '-10% 0px -10% 0px', // Margen para activación
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      clearCurrentInterval();
    };
  }, [startCarousel, clearCurrentInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearCurrentInterval();
    };
  }, [clearCurrentInterval]);

  return {
    currentIndex,
    isHovered,
    isTouching,
    isVisible,
    elementRef,
    handleMouseEnter,
    handleMouseLeave,
    handlePrevImage,
    handleNextImage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};