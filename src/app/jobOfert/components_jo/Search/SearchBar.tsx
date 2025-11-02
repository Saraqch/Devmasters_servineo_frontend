import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from './SearchIcon';
import { Clock } from 'lucide-react';
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
    setIsOpen(false);
  };

  const selectHistory = (item: string) => {
    setValue(item);
    setIsOpen(false);
    setHighlighted(-1);
    onSearch(item);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isOpen && highlighted >= 0 && highlighted < history.length) {
        const item = history[highlighted];
        selectHistory(item);
        return;
      }
      handleSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => (h < history.length - 1 ? h + 1 : 0));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted((h) => (h > 0 ? h - 1 : Math.max(0, history.length - 1)));
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlighted(-1);
      return;
    }
  };

  const hasError = !!error;
  const inputClasses = `pl-10 ${value.length > 0 ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded ${
    hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
  }`;

  React.useEffect(() => {
    setHistory(loadHistory());
  }, []);

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
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50 max-h-60 overflow-auto">
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold uppercase text-slate-500">Búsquedas recientes</span>
                </div>
                <div>{/* espacio para acción futura (p. ej. borrar historial) */}</div>
              </div>

              {history.length === 0 ? (
                <div className="p-3 text-sm text-slate-500">Aún no hay búsquedas recientes</div>
              ) : (
                <ul>
                  {history.map((item, idx) => (
                    <li key={item}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} /* evitar blur antes de click */
                        onClick={() => selectHistory(item)}
                        onMouseEnter={() => setHighlighted(idx)}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-100 focus:bg-slate-100 ${
                          highlighted === idx ? 'bg-slate-100' : ''
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
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
