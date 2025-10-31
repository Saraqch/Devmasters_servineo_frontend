// src/validators/filter.validator.ts
import { z } from 'zod';

const RangeEnum = z.enum(['A-D', 'E-H', 'I-L', 'M-P', 'Q-T', 'U-Z']);

const FilterSchema = z.object({
  range: z.array(RangeEnum).default([]),
  city: z
    .string()
    .trim()
    .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s-]+$/, { message: 'Ciudad inválida.' })
    .optional()
    .or(z.literal('')),
  category: z.array(z.string().trim().regex(/^[A-Za-z0-9\s-]+$/)).default([]),
});

export function validateFilters(filters: unknown) {
  const result = FilterSchema.safeParse(filters);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Error de validación filters';
    return { isValid: false, error: firstError, data: null };
  }
  return { isValid: true, data: result.data };
}
