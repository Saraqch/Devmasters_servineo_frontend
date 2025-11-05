'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

type RangeItem = { label: string; min: number | null; max: number | null };

interface PriceRangesResponse {
  min: number | null;
  max: number | null;
  ranges: Array<{ label: string; min?: number | null; max?: number | null }>;
}

interface PriceRangeListProps {
  onFilterChange?: (filters: { priceRanges: string[]; priceKey?: string }) => void;
  // When this numeric prop changes, the component will clear its selection
  clearSignal?: number;
}

const PriceRangeList: React.FC<PriceRangeListProps> = ({ onFilterChange, clearSignal }) => {
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [ranges, setRanges] = useState<RangeItem[]>([]);
  // Start in loading state to avoid rendering any static/previous markup during mount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic ranges from backend on mount
  useEffect(() => {
    let mounted = true;
    setError(null);

    // Try to read cached ranges from sessionStorage to avoid flicker on remount
    try {
      const cached = sessionStorage.getItem('adv_price_ranges');
      if (cached) {
        const parsed = JSON.parse(cached) as RangeItem[];
        if (Array.isArray(parsed) && parsed.length) {
          setRanges(parsed);
          setLoading(false);
        }
      }
    } catch {
      // ignore cache errors
    }

    // Always attempt to refresh in background to keep data current
    api
      .get<PriceRangesResponse>('/api/devmaster/offers?action=getPriceRanges')
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) {
          const payload = res.data;
          const items: RangeItem[] = Array.isArray(payload.ranges)
            ? payload.ranges.map((r) => ({ label: r.label, min: r.min ?? null, max: r.max ?? null }))
            : [];
          setRanges(items);
          // cache for faster subsequent mounts
          try {
            sessionStorage.setItem('adv_price_ranges', JSON.stringify(items));
          } catch {
            // ignore storage errors
          }
        } else {
          setError(res.error || 'No se pudieron cargar los rangos de precio');
        }
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof Error) setError(err.message);
        else setError('Error desconocido');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCheckboxChange = (rangeValue: string) => {
    const newSelectedRanges = selectedRanges.includes(rangeValue)
      ? selectedRanges.filter((range) => range !== rangeValue)
      : [...selectedRanges, rangeValue];

    setSelectedRanges(newSelectedRanges);

    // If exactly one range is selected, provide priceKey so parent can parse min/max
    const priceKey = newSelectedRanges.length === 1 ? newSelectedRanges[0] : '';
    onFilterChange?.({ priceRanges: newSelectedRanges, priceKey });
  };

  // Reset selections when parent signals a clear
  useEffect(() => {
    if (typeof clearSignal === 'undefined') return;
    setSelectedRanges([]);
    onFilterChange?.({ priceRanges: [], priceKey: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Cargando rangos de precio...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error: {error}</div>;
  }

  if (!ranges.length) {
    return <div className="p-4 text-sm text-gray-500">No hay rangos disponibles</div>;
  }

  function formatRangeLabel(label: string) {
    if (!label) return label;
    // Convert occurrences like "$90" or "$ 90" to "90bs"
    return label.replace(/\$\s*([0-9]+(?:\.[0-9]+)?)/g, '$1bs');
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="max-h-64 overflow-y-auto">
        {ranges.map((r, index) => (
          <label
            key={`${r.label}-${index}`}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== ranges.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedRanges.includes(r.label)}
              onChange={() => handleCheckboxChange(r.label)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700 capitalize">{formatRangeLabel(r.label)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeList;