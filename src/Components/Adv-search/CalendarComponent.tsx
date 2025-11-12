'use client';
import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

const CalendarComponent: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const monthsFull = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };

  const getDayOfWeekName = (date: Date) => {
    const days = ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'];
    return days[date.getDay()];
  };

  const selectedDayOfWeek = getDayOfWeekName(selectedDate);
  const selectedDay = selectedDate.getDate();
  const selectedMonthShort = monthsFull[selectedDate.getMonth()].slice(0, 3) + '.';

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-center py-2 text-gray-400 text-sm">
          {prevMonthDays - i}
        </div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        day === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`text-center py-2 text-sm cursor-pointer rounded-lg transition-colors ${
            isSelected ? 'bg-cyan-500 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          {day}
        </div>,
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="text-center py-2 text-gray-400 text-sm">
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-80">
      {/* Encabezado celeste */}
      <div className="bg-cyan-500 text-white p-4 rounded-t-lg">
        <div className="text-center">
          <div className="text-xs opacity-90">{currentYear}</div>
          <div className="text-lg font-medium">
            {selectedDayOfWeek}, {selectedDay} {selectedMonthShort}
          </div>
        </div>
      </div>

      {/* Calendario (blanco) */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          {/* Flecha izquierda */}
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="text-cyan-600 hover:text-cyan-800 text-xl font-bold"
          >
            ←
          </button>

          {/* Mes y año */}
          <div className="font-medium text-gray-800">
            {monthsFull[currentMonth]} de {currentYear}
          </div>

          {/* Flecha derecha */}
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="text-cyan-600 hover:text-cyan-800 text-xl font-bold"
          >
            →
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-600 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Botones */}
        <div className="mt-4 pt-3 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onDateSelect(selectedDate);
              onClose();
            }}
            className="px-4 py-2 text-sm bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
