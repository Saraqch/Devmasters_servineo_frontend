// src/validators/search.validator.ts
import { z } from 'zod';

const SearchSchema = z
  .string()
  .trim()
  .min(2, { message: 'Introduce al menos 2 caracteres para buscar.' })
  .max(100, { message: 'Límite máximo de 100 caracteres.' })
  .regex(
    /^[A-Za-z0-9ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧÉéÈèÊêËëĒēĔĕĚěĖėÍíÌìÎîÏïĨĩĪīĬĭǏǐÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇ñÑ,_. -]+$/,
    {
      message:
        'Búsqueda inválida. Solo se permiten letras, números y los caracteres "," "_" "." y "-".',
    },
  );

export function validateSearch(search: string) {
  if (typeof search !== 'string') {
    return { isValid: false, error: 'Entrada inválida.', data: null };
  }

  const result = SearchSchema.safeParse(search);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Error de validación search';
    return { isValid: false, error: firstError, data: null };
  }

  return { isValid: true, error: undefined, data: result.data };
}
