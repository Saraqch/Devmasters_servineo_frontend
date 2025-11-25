
import { z } from "zod"

export const jobOfferSchema = z.object({
  title: z.string().min(2, "El título es requerido"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  city: z.string().min(2, "La ciudad es requerida"),
  services: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    )
    .min(1, "Selecciona al menos un servicio"),
  photos: z.array(z.string()).max(5, "No puedes subir más de 5 fotos"),
  price: z.number().min(1, "El precio debe ser mayor a 0").max(9999999999, "El precio no puede exceder 10 dígitos"),
  tags: z.array(z.string()).optional(),
})

export type JobOfferFormData = z.infer<typeof jobOfferSchema>
