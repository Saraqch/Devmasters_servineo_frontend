'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';
import CalendarComponent from './CalendarComponent';

interface Props {
  selectedFilter: string;
  selectedDate: Date | null;
  onChange: (filter: string, date?: Date | null) => void;
  onCalendarToggle?: (isOpen: boolean) => void;
}

const DateFilterSelector: React.FC<Props> = ({
  selectedFilter,
  selectedDate,
  onChange,
  onCalendarToggle,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 🔄 Sincronizar selectedDate (prop) → estados locales (day, month, year)
  useEffect(() => {
    if (selectedDate) {
      setDay(String(selectedDate.getDate()).padStart(2, '0'));
      setMonth(String(selectedDate.getMonth() + 1).padStart(2, '0'));
      setYear(String(selectedDate.getFullYear()));
    } else {
      // Solo limpiamos si el filtro no es 'specific' o si la fecha es null
      if (selectedFilter !== 'specific') {
        setDay('');
        setMonth('');
        setYear('');
      }
    }
  }, [selectedDate, selectedFilter]);

  // 🛠️ Función de validación de fecha
  const isValidDate = useCallback((): boolean => {
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1000) return false;

    // Comprueba si la fecha es válida (ej: evita 30/02)
    const dt = new Date(y, m - 1, d);
    return dt.getDate() === d && dt.getMonth() === m - 1 && dt.getFullYear() === y;
  }, [day, month, year]);

  // 🔗 Mantener la URL en sincronía y notificar al padre sobre cambios de fecha manuales
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Solo si el filtro es 'specific' y hay una entrada completa.
    if (
      selectedFilter !== 'specific' ||
      day.length !== 2 ||
      month.length !== 2 ||
      year.length !== 4
    ) {
      // Limpiar URL si no estamos en 'specific' o si la entrada está incompleta
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('date') && selectedFilter !== 'specific') {
        sp.delete('date');
        const qs = sp.toString();
        const target = qs ? `${pathname}?${qs}` : pathname;
        router.replace(target, { scroll: false });
      } else if (
        selectedFilter === 'specific' &&
        (day.length !== 2 || month.length !== 2 || year.length !== 4)
      ) {
        // Asegurarse de que el padre sabe que la fecha es inválida/incompleta
        onChange('specific', null);
      }
      return;
    }

    // Usar setTimeout para evitar llamadas excesivas al router durante la escritura
    const handler = setTimeout(() => {
      const sp = new URLSearchParams(window.location.search);
      const dateIsValid = isValidDate();

      if (dateIsValid) {
        const iso = `${year}-${month}-${day}`;
        sp.set('date', iso);
        const newDate = new Date(Number(year), Number(month) - 1, Number(day));

        // Notificar al padre solo si la fecha válida actual es diferente a la almacenada.
        if (!selectedDate || newDate.getTime() !== selectedDate.getTime()) {
          onChange('specific', newDate);
        }
      } else {
        sp.delete('date');
        // Notificar al padre que la fecha es inválida
        onChange('specific', null);
      }

      const qs = sp.toString();
      const target = qs ? `${pathname}?${qs}` : pathname;
      // Usar replace con { scroll: false } para evitar desplazamiento al cambiar la URL
      router.replace(target, { scroll: false });
    }, 250); // Debounce de 250ms

    return () => clearTimeout(handler);
  }, [day, month, year, selectedFilter, pathname, router, isValidDate, onChange, selectedDate]);

  // 🖱️ Detectar clics fuera del calendario para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCalendar &&
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
        onCalendarToggle?.(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar, onCalendarToggle]);

  // 🗓️ Manejadores de calendario
  const handleDateSelect = (date: Date) => {
    setShowCalendar(false);
    onCalendarToggle?.(false);
    // La sincronización de estados (day, month, year) y URL ocurre via el useEffect
    onChange('specific', date);
  };

  const handleCalendarToggle = () => {
    const newShowCalendar = !showCalendar;
    setShowCalendar(newShowCalendar);
    onCalendarToggle?.(newShowCalendar);
  };

  // 🎨 Determinar clase de borde según la validación (funcionalidad del segundo código)
  const inputBorderClass =
    selectedFilter === 'specific'
      ? day && month && year
        ? isValidDate()
          ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20'
          : 'border-red-500 ring-2 ring-red-500 ring-opacity-20'
        : 'border-gray-300 focus:ring-[#2B6AE0]'
      : 'border-gray-300';

  return (
    <div>
      <h3 className="text-base mb-2">Fecha de publicación:</h3>

      <div className="bg-white rounded-lg border border-gray-300 p-4 space-y-3 w-fit">
        {/* Opciones de radio: Los más recientes y Los más antiguos */}
        {['recent', 'oldest'].map((filter) => (
          <label
            key={filter}
            className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors"
          >
            <input
              type="radio"
              name="dateFilter"
              value={filter}
              checked={selectedFilter === filter}
              onChange={() => onChange(filter, null)}
              className="w-4 h-4 cursor-pointer flex-shrink-0 text-[#2B6AE0] rounded-full border-gray-300 focus:ring-[#2B6AE0]"
            />
            <span className="text-gray-700 whitespace-nowrap">
              {filter === 'recent' ? 'Los más recientes' : 'Los más antiguos'}
            </span>
          </label>
        ))}

        {/* Opción de fecha específica */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2B31E0] transition-colors">
            <input
              type="radio"
              name="dateFilter"
              value="specific"
              checked={selectedFilter === 'specific'}
              onChange={() => onChange('specific', null)}
              className="w-4 h-4 cursor-pointer flex-shrink-0 text-[#2B6AE0] rounded-full border-gray-300 focus:ring-[#2B6AE0]"
            />
            <span className="text-gray-700 font-medium whitespace-nowrap">Fecha específica:</span>
          </label>

          {/* Inputs de fecha y botón de calendario - solo visible cuando "specific" está seleccionado */}
          {selectedFilter === 'specific' && (
            <div className="flex flex-col gap-1 ml-6">
              <div className="flex items-center gap-2">
                {/* Día */}
                <input
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  placeholder="DD"
                  maxLength={2}
                  className={`w-12 px-2 py-2 border rounded-lg text-sm font-mono text-center bg-white focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`}
                />

                <span className="text-gray-500 text-xl flex items-center justify-center h-full">
                  /
                </span>

                {/* Mes */}
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  placeholder="MM"
                  maxLength={2}
                  className={`w-12 px-2 py-2 border rounded-lg text-sm font-mono text-center bg-white focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`}
                />

                <span className="text-gray-500 text-xl flex items-center justify-center h-full">
                  /
                </span>

                {/* Año */}
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="AAAA"
                  maxLength={4}
                  className={`w-20 px-2 py-2 border rounded-lg text-sm font-mono text-center bg-white focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`}
                />

                {/* Calendario */}
                <div className="relative" ref={calendarContainerRef}>
                  <button
                    type="button"
                    onClick={handleCalendarToggle}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={18} className="text-gray-600" />
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {/* Calendario desplegable */}
                  {showCalendar && (
                    <div className="absolute z-50 mt-2 -left-100">
                      {' '}
                      {/* Ajuste de posición para mejor UX */}
                      <CalendarComponent
                        selectedDate={selectedDate || new Date()}
                        onDateSelect={handleDateSelect}
                        onClose={() => {
                          setShowCalendar(false);
                          onCalendarToggle?.(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje de fecha inválida (funcionalidad del segundo código) */}
              {day.length === 2 && month.length === 2 && year.length === 4 && !isValidDate() && (
                <p className="text-red-500 text-sm">Fecha inválida</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilterSelector;
