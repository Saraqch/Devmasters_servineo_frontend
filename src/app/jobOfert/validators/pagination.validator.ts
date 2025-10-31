// src/validators/pagination.validator.ts
import { z } from 'zod';

const allowedLimits = [10, 20, 30, 50, 100];

const PaginationSchema = z.object({
  page: z.number().int().min(1, { message: 'La página mínima es 1.' }).default(1),
  limit: z
    .number()
    .int()
    .refine((n) => allowedLimits.includes(n), { message: 'Límite no permitido.' })
    .default(10),
});

export function validatePagination(page: number, limit: number) {
  const result = PaginationSchema.safeParse({ page, limit });

  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Error de validación pagination';
    return { isValid: false, error: firstError, data: null };
  }

  return { isValid: true, data: result.data };
}

export { PaginationSchema };
