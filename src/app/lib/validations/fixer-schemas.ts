import { z } from "zod"

// Schema para el registro inicial
const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/
const phoneRegex = /^\+?[\d\s\-()]{8,}$/

export const initialRegistrationSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(40, "El nombre no puede tener más de 30 caracteres")
    .regex(nameRegex, "El nombre solo puede contener letras y espacios")
    .transform(value => value.trim()),
  email: z
    .string()
    .email("Email inválido")
    .transform(value => value.toLowerCase()),
  phone: z
    .string()
    .regex(phoneRegex, "Formato de teléfono inválido. Debe incluir al menos 8 dígitos")
    .refine((value) => {
      // Contar solo los dígitos (excluyendo +, - y espacios)
      const digitCount = value.replace(/\D/g, '').length
      return digitCount <= 12
    }, "El número de teléfono no puede tener más de 10 dígitos")
    .transform(value => value.trim()),
})

// ... el resto de tus schemas se mantiene igual
export const ciSchema = z.object({
  ci: z
    .string()
    .min(1, "CI es requerido")
    .regex(/^[0-9-]+$/, "CI debe contener solo números y guiones"),
})

// Schema para ubicación
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// Schema para servicios
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del servicio es requerido"),
  custom: z.boolean().optional(),
})

export const servicesStepSchema = z.object({
  selectedServiceIds: z.array(z.string()).min(1, "Seleccione al menos un servicio"),
})

// Schema para métodos de pago
export const paymentMethodSchema = z.enum(["cash", "qr", "card"])

export const paymentStepSchema = z.object({
  payments: z.array(paymentMethodSchema).min(1, "Seleccione al menos un método de pago"),
  accountInfo: z.string().optional(),
})

// Schema para experiencias
export const experienceSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  mediaUrl: z.string().url("URL inválida"),
  mediaType: z.enum(["image", "video"]),
})

// Schema para vehículo
export const vehicleSchema = z.object({
  hasVehicle: z.boolean(),
  vehicleType: z.enum(["motorcycle", "car", "van", "truck"]).optional(),
})

// Schema para términos
export const termsSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, "Debe aceptar los términos y condiciones"),
})

// Schema para foto de perfil
export const profilePhotoSchema = z.object({
  photoUrl: z.string().url("URL de foto inválida").optional(),
})

// Schema completo del perfil de FIXER
export const fixerProfileSchema = z
  .object({
    ci: z.string().regex(/^[0-9-]+$/, "CI debe contener solo números y guiones"),
    location: locationSchema,
    selectedServiceIds: z.array(z.string()).min(1),
    payments: z.array(paymentMethodSchema).min(1),
    accountInfo: z.string().optional(),
    experiences: z.array(experienceSchema),
    hasVehicle: z.boolean(),
    vehicleType: z.enum(["motorcycle", "car", "van", "truck"]).optional(),
    termsAccepted: z.boolean(),
    photoUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const needsAccount = data.payments.includes("qr") || data.payments.includes("card")
      return !needsAccount || (data.accountInfo && data.accountInfo.trim().length > 0)
    },
    {
      message: "Debe proporcionar información de cuenta para pagos QR o tarjeta",
      path: ["accountInfo"],
    },
  )
  .refine(
    (data) => {
      return !data.hasVehicle || data.vehicleType
    },
    {
      message: "Debe seleccionar el tipo de vehículo",
      path: ["vehicleType"],
    },
  )

export type InitialRegistrationData = z.infer<typeof initialRegistrationSchema>
export type CIData = z.infer<typeof ciSchema>
export type LocationData = z.infer<typeof locationSchema>
export type ServiceData = z.infer<typeof serviceSchema>
export type PaymentMethodType = z.infer<typeof paymentMethodSchema>
export type ExperienceData = z.infer<typeof experienceSchema>
export type VehicleData = z.infer<typeof vehicleSchema>
export type FixerProfileData = z.infer<typeof fixerProfileSchema>