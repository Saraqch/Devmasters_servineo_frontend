import React, { useState, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import CalendarComponent from './CalendarComponent';

const DateFilterSelector: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('specific');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    setRawInput(`${day}${month}${year}`);
    setShowCalendar(false);
  };

  const formatDisplay = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 8);
    const day = nums.slice(0, 2).padEnd(2, '_');
    const month = nums.slice(2, 4).padEnd(2, '_');
    const year = nums.slice(4, 8).padEnd(4, '_');
    return `${day} / ${month} / ${year}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setRawInput(value);

    const input = inputRef.current;
    if (!input) return;

    setTimeout(() => {
      let pos = 0;
      if (value.length <= 2) pos = value.length;
      else if (value.length <= 4) pos = value.length + 3;
      else pos = value.length + 6;
      input.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const pos = input.selectionStart || 0;

    setTimeout(() => {
      let newPos = 0;
      if (pos <= 2) newPos = Math.min(rawInput.length, 2);
      else if (pos <= 7) newPos = Math.min(rawInput.length, 4) + 3;
      else newPos = rawInput.length + 6;
      input.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Fecha de publicación:</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">

        {['recent', 'oldest'].map((filter) => (
          <label key={filter} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="dateFilter"
              value={filter}
              checked={selectedFilter === filter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-5 h-5 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {filter === 'recent' ? 'Los más recientes' : 'Los más antiguos'}
            </span>
          </label>
        ))}

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="radio"
            name="dateFilter"
            value="specific"
            checked={selectedFilter === 'specific'}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-5 h-5 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
          />
          <span className="text-gray-700 font-medium">Fecha específica:</span>

          <input
            ref={inputRef}
            type="text"
            value={formatDisplay(rawInput)}
            onChange={handleInputChange}
            onClick={handleClick}
            placeholder="dd / mm / aaaa"
            className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            style={{ letterSpacing: '1px' }}
          />

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            type="button"
          >
            <Calendar size={18} className="text-gray-600" />
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </label>

        {showCalendar && selectedFilter === 'specific' && (
          <div className="absolute z-50 mt-2 ml-32">
            <CalendarComponent
              selectedDate={selectedDate || new Date()}
              onDateSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        )}

      </div>

    </div>
  );
};

export default DateFilterSelector;