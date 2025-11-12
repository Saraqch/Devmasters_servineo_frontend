'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type FilterParamValue = string | string[] | number | boolean | null;

interface Props {
  params: Record<string, FilterParamValue>;
  onModify?: () => void;
}

function renderValue(v: FilterParamValue) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

function formatPriceString(s: string) {
  if (!s) return s;
  // Replace occurrences like "$90" or "$ 90" with "90bs"
  const replaced = s.replace(/\$\s*([0-9]+(?:\.[0-9]+)?)/g, '$1bs');
  return replaced;
}

export default function AppliedFilters({ params, onModify }: Props) {
  const router = useRouter();

  const handleModify = () => {
    if (onModify) return onModify();
    // default behavior: go back to AdvSearch preserving params
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, val]) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach((v) => sp.append(k, String(v)));
      } else {
        sp.set(k, String(val));
      }
    });
    router.push(`/adv-search?${sp.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4">
      <div className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between font-['Roboto'] text-sm">
        <div>
          <p className="text-sm font-semibold text-gray-700">Búsqueda:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(() => {
              // Render combined price tag when minPrice and/or maxPrice exist
              const minRaw = params['minPrice'] as FilterParamValue;
              const maxRaw = params['maxPrice'] as FilterParamValue;
              const tags: React.ReactNode[] = [];

              const hasMin = minRaw != null && minRaw !== '';
              const hasMax = maxRaw != null && maxRaw !== '';

              if (hasMin || hasMax) {
                const minN = Number(minRaw);
                const maxN = Number(maxRaw);
                const minValid = !Number.isNaN(minN);
                const maxValid = !Number.isNaN(maxN);
                let text = 'Precio:';
                if (minValid && maxValid) {
                  text = `Precio: ${minN}bs - ${maxN}bs`;
                } else if (minValid && !maxValid) {
                  // Selector shows "Más de $X"
                  text = `Precio: Más de ${minN}bs`;
                } else if (!minValid && maxValid) {
                  // Selector shows "Menos de $X"
                  text = `Precio: Menos de ${maxN}bs`;
                }

                tags.push(
                  <span
                    key="price"
                    className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                  >
                    {text}
                  </span>,
                );
              }

              // Render other params except minPrice/maxPrice
              Object.entries(params).forEach(([k, v]) => {
                if (k === 'minPrice' || k === 'maxPrice') return;

                // Show sort tag when provided
                if (k === 'sortBy' && typeof v === 'string') {
                  const txt =
                    v === 'recent'
                      ? 'Los más recientes'
                      : v === 'oldest'
                        ? 'Los más antiguos'
                        : String(v);
                  tags.push(
                    <span
                      key={k}
                      className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                    >
                      {txt}
                    </span>,
                  );
                  return;
                }

                if (k === 'titleOnly' && v === true) {
                  tags.push(
                    <span
                      key={k}
                      className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                    >
                      Buscar solo en el título de la Oferta de Trabajo
                    </span>,
                  );
                  return;
                }

                if (k === 'exact' && v === true) {
                  tags.push(
                    <span
                      key={k}
                      className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                    >
                      Palabras Exactas
                    </span>,
                  );
                  return;
                }

                // Special display for date
                if (k === 'date' && typeof v === 'string') {
                  // expect YYYY-MM-DD
                  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                  const dateLabel = m ? `${m[3]}/${m[2]}/${m[1]}` : String(v);
                  tags.push(
                    <span
                      key={k}
                      className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                    >
                      {`Fecha: ${dateLabel}`}
                    </span>,
                  );
                  return;
                }

                let value = renderValue(v as FilterParamValue);
                if (!value) return;
                // If the value contains a dollar sign, convert to 'bs' like in selectors
                if (value.includes('$')) {
                  value = formatPriceString(value);
                }
                tags.push(
                  <span
                    key={k}
                    className="inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded"
                  >
                    {value}
                  </span>,
                );
              });

              return tags;
            })()}
          </div>
        </div>

        <div className="flex items-center mt-3">
          <button
            type="button"
            onClick={handleModify}
            className="bg-[#2B6AE0] text-white hover:bg-[#2B6AE0]/90 px-4 py-2 text-sm sm:text-base font-roboto font-semibold rounded shadow transition-all duration-200"
          >
            Modificar
          </button>
        </div>
      </div>
    </div>
  );
}
