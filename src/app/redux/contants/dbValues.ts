/**
 * Valores que se envían al backend (en español)
 * Estos son los valores tal como están en la base de datos
 */
export const DB_VALUES = {
  ranges: [
    'De (A-C)',
    'De (D-F)',
    'De (G-I)',
    'De (J-L)',
    'De (M-Ñ)',
    'De (O-Q)',
    'De (R-T)',
    'De (U-W)',
    'De (X-Z)',
  ] as const,

  cities: [
    'Beni',
    'Chuquisaca',
    'Cochabamba',
    'La Paz',
    'Oruro',
    'Pando',
    'Potosí',
    'Santa Cruz',
    'Tarija',
  ] as const,

  jobTypes: [
    'Albañil',
    'Carpintero',
    'Cerrajero',
    'Decorador',
    'Electricista',
    'Fontanero',
    'Fumigador',
    'Instalador',
    'Jardinero',
    'Limpiador',
    'Mecánico',
    'Montador',
    'Pintor',
    'Pulidor',
    'Soldador',
    'Techador',
    'Vidriero',
    'Yesero',
  ] as const,

  categories: [
    'Todos',
    'Albañil',
    'Carpintero',
    'Cerrajero',
    'Decorador',
    'Electricista',
    'Fontanero',
    'Fumigador',
    'Instalador',
    'Jardinero',
    'Limpiador',
    'Mecánico',
    'Montador',
    'Pintor',
    'Pulidor',
    'Soldador',
    'Techador',
    'Vidriero',
    'Yesero',
  ] as const,
} as const;

// Tipos derivados para TypeScript
export type RangeValue = typeof DB_VALUES.ranges[number];
export type CityValue = typeof DB_VALUES.cities[number];
export type JobTypeValue = typeof DB_VALUES.jobTypes[number];
export type CategoryValue = typeof DB_VALUES.categories[number];