import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { Clock, X, Trash2, Star, ArrowUpLeft } from 'lucide-react';
import { ClearButton } from './ClearButton';
import { SearchButton } from './SearchButton';
import { FilterButton } from '../Filter/FilterButton';
import { validateSearch } from '../../validators/search.validator';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
}

export const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const HISTORY_KEY = 'job_search_history_v1';

  const deleteFromBackend = async (searchTerm: string) => {
   try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devmaster/offers?action=deleteHistory&searchTerm=${encodeURIComponent(searchTerm)}&sessionId=${encodeURIComponent(sessionId)}`;
    
      await fetch(url);
    } catch (error) {
      console.error('Error eliminando del backend:', error);
   }
  };

  const clearAllHistoryBackend = async () => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devmaster/offers?action=clearAllHistory&sessionId=${encodeURIComponent(sessionId)}`;
    
    await fetch(url);
  } catch (error) {
    console.error('Error limpiando historial del backend:', error);
   }
  };

   const fetchHistoryFromBackend = async (searchTerm: string = '') => {
    try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      return [];
    }

    // ✅ Usar el endpoint correcto de historial
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devmaster/offers?action=getHistory&search=${encodeURIComponent(searchTerm)}&sessionId=${encodeURIComponent(sessionId)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success && data.searchHistory) {
      return data.searchHistory.map((item: any) => item.searchTerm);
    }
    
    return [];
  } catch (error) {
    console.error('Error obteniendo historial del backend:', error);
    return [];
  }
};

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [] as string[];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [] as string[];
    }
  };

  const persistHistory = (items: string[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      // ignorar errores de almacenamiento
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setValue(newValue);
  const { isValid, error } = validateSearch(newValue);
  setError(isValid ? undefined : error);
  setHighlighted(-1);
};

  const handleClear = () => {
    setValue('');
    setError(undefined);
    onSearch('');
  };

  const addToHistory = (q: string) => {
    if (!q || q.trim().length === 0) return;
    setHistory((prev) => {
      const uniq = [q, ...prev.filter((p) => p !== q)].slice(0, 10);
      persistHistory(uniq);
      return uniq;
    });
  };

  const clearHistory = () => {
    persistHistory([]);
    setHistory([]);
    clearAllHistoryBackend();
    setIsOpen(true);
  };

  const selectHistory = (item: string) => {
    setValue(item);
    setIsOpen(false);
    setHighlighted(-1);
    onSearch(item);
  };

  const deleteHistoryItem = async (item: string) => {
    await deleteFromBackend(item);
    const updatedHistory = await fetchHistoryFromBackend(value.trim());
    setHistory(updatedHistory);
    persistHistory(updatedHistory);
    setHighlighted(-1);
  };

  // soporte de toque / pulsación larga en móvil: mostrar acciones Eliminar/Cancelar
  const [longPressedItem, setLongPressedItem] = React.useState<string | null>(null);
  const touchTimerRef = React.useRef<number | null>(null);

  const handleTouchStart = (item: string) => () => {
    // iniciar un temporizador para detectar pulsación larga (600 ms)
    clearTouchTimer();
    touchTimerRef.current = window.setTimeout(() => {
      setLongPressedItem(item);
    }, 600) as unknown as number;
  };

  // eventos pointer (funciona con la emulación táctil de Opera/DevTools)
  const handlePointerDown = (item: string) => (e: React.PointerEvent) => {
    // ignorar punteros de ratón
    // pointerType puede ser 'touch' al emular en escritorio
    if (e.pointerType === 'mouse') return;
    clearTouchTimer();
    touchTimerRef.current = window.setTimeout(() => {
      setLongPressedItem(item);
    }, 600) as unknown as number;
  };

  const clearTouchTimer = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current as unknown as number);
      touchTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    clearTouchTimer();
  };

  const handleSearch = () => {
    const { isValid, error, data } = validateSearch(value);
    if (!isValid) {
      setError(error);
      return;
    }
    const query = data!;
    onSearch(query);
    addToHistory(query);
    setIsOpen(false);
  };

  const hasError = !!error;
  const inputClasses = `pl-10 ${value.length > 0 ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded ${
    hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
  }`;

  React.useEffect(() => {
    const loadInitialHistory = async () => {
      const backendHistory = await fetchHistoryFromBackend('');
      if (backendHistory.length > 0) {
        setHistory(backendHistory);
        persistHistory(backendHistory);
      } else {
        setHistory(loadHistory());
      }
    };
  
  loadInitialHistory();
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
     // Si está vacío, cargar todo el historial
      // Si tiene texto, filtrar
     const filteredHistory = await fetchHistoryFromBackend(value.trim());
     setHistory(filteredHistory);
    }, 0);
  
    return () => clearTimeout(timer);
  }, [value]);

  // limitar historial visible a 5 ítems
  const visibleHistory = React.useMemo(() => history.slice(0, 5), [history]);
  // sugerencias de ejemplo (se puede reemplazar por una API más adelante)
  const sampleSuggestions = React.useMemo(
    () => [
      'Albañil',
      'Carpintero',
      'Electricista',
      'Fontanero',
      'Plomero',
      'Pintor',
      'Cerrajero',
      'Jardinero',
    ],
    []
  );

  const filteredSuggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) return [] as string[];
    return sampleSuggestions.filter((s) => s.toLowerCase().includes(q));
  }, [value, sampleSuggestions]);

  // limitar sugerencias visibles a 5
  const visibleSuggestions = React.useMemo(() => filteredSuggestions.slice(0, 5), [filteredSuggestions]);

  // lista combinada usada para la navegación por teclado: historial primero, luego sugerencias
  const visibleCombined = React.useMemo(() => {
    return [...visibleHistory, ...visibleSuggestions];
  }, [visibleHistory, visibleSuggestions]);

  const selectItem = (item: string) => {
    setValue(item);
    onSearch(item);
    addToHistory(item);
    setIsOpen(false);
    setHighlighted(-1);
  };

  const previewItem = (item: string) => {
    // poner el valor en el input pero NO ejecutar la búsqueda — permitir editar
    setValue(item);
    setError(undefined);
    setIsOpen(true);
    setHighlighted(-1);
    const input = inputRef.current;
    if (input) {
      // enfocar el input y mover el cursor al final
      input.focus();
      try {
        const len = input.value.length;
        input.setSelectionRange(len, len);
      } catch {
        // ignorar errores al mover el cursor
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const combinedLen = visibleCombined.length;
      if (isOpen && highlighted >= 0 && highlighted < combinedLen) {
        const item = visibleCombined[highlighted];
        selectItem(item);
        return;
      }
      handleSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => {
        const max = visibleCombined.length - 1;
        return h < max ? h + 1 : 0;
      });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => {
        const max = visibleCombined.length - 1;
        return h > 0 ? h - 1 : Math.max(0, max);
      });
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlighted(-1);
      return;
    }
  };

  // click fuera para cerrar
  React.useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (ev.target instanceof Node && !containerRef.current.contains(ev.target)) {
        setIsOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-row w-full items-center gap-2">
        <div className="relative flex-1 min-w-0 self-center">
          <SearchIcon hasError={hasError} />
          <Input
            type="text"
            placeholder="¿Qué servicio necesitas?"
            className={inputClasses}
            value={value}
            onChange={handleChange}
            ref={(el) => {
              inputRef.current = el as HTMLInputElement | null;
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsOpen(true);
            }}
          />
          {value.length > 0 && <ClearButton onClick={handleClear} />}

          {/* Dropdown de historial (ahora siempre muestra el encabezado; lista puede estar vacía) */}
          {isOpen && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50"
              onMouseLeave={() => setHighlighted(-1)}
              onPointerLeave={() => setHighlighted(-1)}
            >
              <div className="px-2 py-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold uppercase text-slate-500">Búsquedas recientes</span>
                </div>
                <div className="w-8 flex items-center justify-center sm:justify-end sm:w-auto">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await clearHistory();
                    }}
                    className="mr-1 flex items-center gap-1 text-sm text-red-500 cursor-pointer px-2 py-1 rounded hover:bg-red-50 whitespace-nowrap"
                    aria-label="Borrar historial"
                  >
                    <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="ml-1 text-sm hidden sm:inline">Borrar historial</span>
                  </button>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="p-3 text-sm text-slate-500">Aún no hay búsquedas recientes</div>
              ) : (
                <ul>
                  {visibleHistory.map((item, idx) => (
                    <li key={item}>
                      {longPressedItem === item ? (
                        <div className="w-full flex items-center justify-between px-2 py-2 bg-red-50 border-l-4 border-red-500">
                          <div className="text-sm text-red-700 font-medium leading-tight">
                            Eliminar<br />búsqueda
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteHistoryItem(item);
                                setLongPressedItem(null);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => setLongPressedItem(null)}
                              className="bg-slate-100 border border-slate-200 px-3 py-1 rounded text-sm text-slate-700 hover:bg-slate-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onMouseDown={(e) => e.preventDefault()} /* evitar blur antes de click */
                          onClick={() => selectHistory(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') selectHistory(item);
                          }}
                          onMouseEnter={() => setHighlighted(idx)}
                          onTouchStart={handleTouchStart(item)}
                          onTouchEnd={handleTouchEnd}
                          onTouchMove={handleTouchEnd}
                          onTouchCancel={handleTouchEnd}
                          onPointerDown={handlePointerDown(item)}
                          onPointerUp={handleTouchEnd}
                          onPointerMove={handleTouchEnd}
                          onPointerCancel={handleTouchEnd}
                          className={`group w-full flex items-center justify-between gap-2 px-2 py-1 hover:bg-slate-50 focus:bg-slate-50 ${
                            highlighted === idx ? 'bg-slate-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1 min-w-0 flex-1">
                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap flex-1" title={item}>{item}</span>
                          </div>

                          <div className="flex items-center justify-end gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                previewItem(item);
                              }}
                              className="sm:hidden p-1 rounded text-slate-400"
                              aria-label={`Previsualizar ${item}`}
                            >
                              <ArrowUpLeft className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await deleteHistoryItem(item);
                              }}
                              className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity cursor-pointer"
                              aria-label={`Eliminar ${item}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Sugerencias: aparece cuando el usuario escribe */}
              {value.trim().length > 0 && (
                <div className="mt-2">
                    <div className="px-2 py-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-semibold uppercase text-slate-500">Sugerencias</span>
                      </div>
                    </div>

                  {filteredSuggestions.length === 0 ? (
                    <div className="p-3 text-sm text-slate-500">No hay sugerencias</div>
                  ) : (
                    <ul>
                      {visibleSuggestions.map((sugg, i) => {
                        const combinedIndex = visibleHistory.length + i;
                        return (
                          <li key={sugg}>
                            <div
                              role="button"
                              tabIndex={0}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectItem(sugg)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') selectItem(sugg);
                              }}
                              onMouseEnter={() => setHighlighted(combinedIndex)}
                              className={`w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-50 cursor-pointer min-w-0 ${
                                highlighted === combinedIndex ? 'bg-slate-50' : ''
                              }`}
                            >
                              <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              <span className="text-sm text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap" title={sugg}>{sugg}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* footer removed per design: no clear history button */}
            </div>
          )}
        </div>
        <SearchButton onClick={handleSearch} />
        {onFilter && <FilterButton onClick={onFilter} />}
      </div>
      <div className="h-2 mt-1">{hasError && <p className="text-red-500 text-sm">{error}</p>}</div>
    </div>
  );
};