'use client';

import { Search, Clock, X, Trash2, Star, ArrowUpLeft } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onSearch?: (query: string) => void; // Nueva prop opcional
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar trabajos, ubicaciones, servicios...',
  className = '',
  disabled = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [longPressedItem, setLongPressedItem] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const touchTimerRef = useRef<number | null>(null);

  const HISTORY_KEY = 'job_search_history_v1';

  // Función para realizar la búsqueda con redirección
  const performSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        // Si hay callback personalizado, usarlo
        if (onSearch) {
          onSearch(trimmedQuery);
        } else {
          // Redirección por defecto
          router.push(`/jobOfert?search=${encodeURIComponent(trimmedQuery)}`);
        }
      } else {
        // Si está vacío, ir a la página sin parámetros
        if (onSearch) {
          onSearch('');
        } else {
          router.push('/jobOfert');
        }
      }
    },
    [router, onSearch],
  );

  // Cargar historial inicial desde localStorage
  const loadHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  // Persistir historial en localStorage
  const persistHistory = useCallback((items: string[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      // ignorar errores
    }
  }, []);

  // Cargar historial al montar
  useEffect(() => {
    const initialHistory = loadHistory();
    setHistory(initialHistory);
  }, [loadHistory]);

  // Agregar al historial cuando el usuario hace búsqueda (Enter)
  const addToHistory = useCallback(
    (query: string) => {
      if (!query || query.trim().length === 0) return;
      setHistory((prev) => {
        const unique = [query, ...prev.filter((p) => p !== query)].slice(0, 10);
        persistHistory(unique);
        return unique;
      });
    },
    [persistHistory],
  );

  // Limpiar todo el historial
  const clearHistory = useCallback(() => {
    persistHistory([]);
    setHistory([]);
    setIsOpen(true);
  }, [persistHistory]);

  // Eliminar item del historial
  const deleteHistoryItem = useCallback(
    (item: string) => {
      setHistory((prev) => {
        const updated = prev.filter((h) => h !== item);
        persistHistory(updated);
        return updated;
      });
      setHighlighted(-1);
    },
    [persistHistory],
  );

  // Generar sugerencias basadas en el historial
  useEffect(() => {
    const q = value.trim().toLowerCase();

    if (q.length > 0) {
      // Filtrar historial que coincida pero que no sea exacto
      const filtered = history
        .filter((h) => h.toLowerCase().includes(q) && h.toLowerCase() !== q)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [value, history]);

  // Filtrar historial visible
  const visibleHistory = useCallback(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) {
      return history.slice(0, 5);
    }
    return history.filter((h) => h.toLowerCase().includes(q)).slice(0, 5);
  }, [history, value])();

  const visibleSuggestions = suggestions.slice(0, 5);
  const visibleCombined = [...visibleHistory, ...visibleSuggestions];

  // Seleccionar item (historial o sugerencia)
  const selectItem = useCallback(
    (item: string) => {
      onChange(item);
      addToHistory(item);
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);

      // Realizar la búsqueda automáticamente
      performSearch(item);
    },
    [onChange, addToHistory, performSearch],
  );

  // Preview item
  const previewItem = useCallback((item: string) => {
    setPreviewValue(item);
    setIsOpen(true);
    setHighlighted(-1);
    inputRef.current?.focus();
  }, []);

  // Manejo de teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const combinedLen = visibleCombined.length;
      if (isOpen && highlighted >= 0 && highlighted < combinedLen) {
        const item = visibleCombined[highlighted];
        selectItem(item);
        return;
      }
      const searchValue = previewValue ?? value;
      if (searchValue.trim()) {
        addToHistory(searchValue.trim());
        setIsOpen(false);
        setPreviewValue(null);

        // Realizar la búsqueda
        performSearch(searchValue.trim());
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => {
        const max = visibleCombined.length - 1;
        const next = h < max ? h + 1 : 0;
        if (visibleCombined[next]) {
          setPreviewValue(visibleCombined[next]);
        }
        return next;
      });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => {
        const max = visibleCombined.length - 1;
        const next = h > 0 ? h - 1 : Math.max(0, max);
        if (visibleCombined[next]) {
          setPreviewValue(visibleCombined[next]);
        }
        return next;
      });
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);
      return;
    }
  };

  // Touch handlers para mobile
  const clearTouchTimer = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleTouchStart = (item: string) => () => {
    clearTouchTimer();
    touchTimerRef.current = window.setTimeout(() => {
      setLongPressedItem(item);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTouchTimer();
  };

  // Click fuera para cerrar
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (ev.target instanceof Node && !containerRef.current.contains(ev.target)) {
        setIsOpen(false);
        setHighlighted(-1);
        setPreviewValue(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setPreviewValue(null);
  };

  return (
    <div className={`flex-1 relative group ${className}`} ref={containerRef}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Search
          className={`w-5 h-5 transition-all duration-300 ${
            isFocused
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
              : 'text-muted-foreground group-hover:text-blue-500'
          }`}
        />
      </div>

      {value && !disabled && (
        <button
          onClick={() => {
            onChange('');
            setPreviewValue(null);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={previewValue ?? value}
        onChange={handleInputChange}
        onFocus={() => {
          setIsFocused(true);
          setIsOpen(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          // Delay para permitir clicks en el dropdown
          setTimeout(() => {
            if (!containerRef.current?.contains(document.activeElement)) {
              setIsOpen(false);
              setPreviewValue(null);
            }
          }, 200);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full pl-12 pr-12 py-4 
          bg-white/90 backdrop-blur-md
          border-2 rounded-2xl
          font-medium text-foreground placeholder:text-muted-foreground/60
          transition-all duration-300 ease-out
          shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isFocused
              ? 'border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02] bg-white'
              : 'border-primary hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
          }
          ${disabled ? 'bg-gray-100' : ''}
        `}
      />

      {isFocused && !disabled && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      )}

      {/* Dropdown de historial y sugerencias */}
      {isOpen && !disabled && (visibleHistory.length > 0 || visibleSuggestions.length > 0) && (
        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-primary/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-md">
          {/* Sección de Historial */}
          {visibleHistory.length > 0 && (
            <>
              <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold uppercase text-slate-600">
                    Búsquedas Recientes
                  </span>
                </div>
                {history.length > 0 && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearHistory();
                    }}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpiar</span>
                  </button>
                )}
              </div>

              <ul className="max-h-60 overflow-y-auto">
                {visibleHistory.map((item, idx) => (
                  <li key={`${item}-${idx}`}>
                    {longPressedItem === item ? (
                      <div className="w-full flex items-center justify-between px-4 py-3 bg-red-50 border-l-4 border-red-500">
                        <div className="flex-1 text-sm text-red-700 font-medium">
                          ¿Eliminar esta búsqueda?
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              deleteHistoryItem(item);
                              setLongPressedItem(null);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setLongPressedItem(null)}
                            className="bg-white border border-slate-300 px-3 py-1 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectItem(item)}
                        onMouseEnter={() => setHighlighted(idx)}
                        onTouchStart={handleTouchStart(item)}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchEnd}
                        className={`group w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${
                          highlighted === idx ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-700 truncate" title={item}>
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              previewItem(item);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            <ArrowUpLeft className="w-4 h-4" />
                          </button>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryItem(item);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Sección de Sugerencias */}
          {value.trim().length > 0 && visibleSuggestions.length > 0 && (
            <div className={visibleHistory.length > 0 ? 'border-t-2 border-primary/10' : ''}>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold uppercase text-slate-600">
                    Sugerencias
                  </span>
                </div>
              </div>

              <ul className="max-h-60 overflow-y-auto">
                {visibleSuggestions.map((sugg, i) => {
                  const combinedIndex = visibleHistory.length + i;
                  return (
                    <li key={sugg}>
                      <div
                        role="button"
                        tabIndex={0}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectItem(sugg)}
                        onMouseEnter={() => setHighlighted(combinedIndex)}
                        className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors ${
                          highlighted === combinedIndex ? 'bg-purple-50' : ''
                        }`}
                      >
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate" title={sugg}>
                          {sugg}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
