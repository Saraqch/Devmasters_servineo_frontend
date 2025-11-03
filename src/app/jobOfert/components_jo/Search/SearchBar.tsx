import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { Clock, X, Trash2, Star } from 'lucide-react';
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

  const HISTORY_KEY = 'job_search_history_v1';

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [] as string[];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [] as string[];
    }
  };

  const persistHistory = (items: string[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore storage errors
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const { isValid, error } = validateSearch(e.target.value);
    setError(isValid ? undefined : error);
    // reset any keyboard/mouse highlight when the user types
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
    // keep dropdown open so user sees the empty state
    setIsOpen(true);
  };

  const selectHistory = (item: string) => {
    setValue(item);
    setIsOpen(false);
    setHighlighted(-1);
    onSearch(item);
  };

  const deleteHistoryItem = (item: string) => {
    setHistory((prev) => {
      const updated = prev.filter((p) => p !== item);
      persistHistory(updated);
      return updated;
    });
    // if the highlighted item was removed, reset
    setHighlighted(-1);
  };

  // touch / long-press support for mobile: show delete/cancel actions
  const [longPressedItem, setLongPressedItem] = React.useState<string | null>(null);
  const touchTimerRef = React.useRef<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(!!touch);
    }
  }, []);

  const handleTouchStart = (item: string) => (e: React.TouchEvent) => {
    // start a timer to detect long press (600ms)
    clearTouchTimer();
    touchTimerRef.current = window.setTimeout(() => {
      setLongPressedItem(item);
    }, 600) as unknown as number;
  };

  // pointer events (works with Opera/DevTools touch emulation)
  const handlePointerDown = (item: string) => (e: React.PointerEvent) => {
    // ignore mouse pointers
    // pointerType may be 'touch' when emulating on desktop
    if ((e as any).pointerType === 'mouse') return;
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
    setHistory(loadHistory());
  }, []);

  // limit visible history to 5 items
  const visibleHistory = React.useMemo(() => history.slice(0, 5), [history]);
  // sample suggestions (could be replaced by API later)
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

  // limit visible suggestions to 5
  const visibleSuggestions = React.useMemo(() => filteredSuggestions.slice(0, 5), [filteredSuggestions]);

  // combined list used for keyboard navigation: history items first, then suggestions
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

  // click outside to close
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
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearHistory();
                    }}
                    className="flex items-center gap-1 text-sm text-red-500 cursor-pointer"
                    aria-label="Borrar historial"
                  >
                    <Trash2 className="w-4 h-4" />
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
                          <div className="text-sm text-red-700 font-medium">Eliminar búsqueda</div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                deleteHistoryItem(item);
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
                          className={`group w-full flex items-center justify-between px-2 py-1 hover:bg-slate-50 focus:bg-slate-50 ${
                            highlighted === idx ? 'bg-slate-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryItem(item);
                            }}
                            className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity cursor-pointer"
                            aria-label={`Eliminar ${item}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                              className={`w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-50 cursor-pointer ${
                                highlighted === combinedIndex ? 'bg-slate-50' : ''
                              }`}
                            >
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-slate-700">{sugg}</span>
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
