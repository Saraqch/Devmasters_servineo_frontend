/**
 * Mapeo de valores de BD a keys de traducción
 * Usado para componentes que necesitan traducir valores del backend
 */
export const DB_TO_TRANSLATION_KEY = {
  // Rangos de nombres
  'De (A-C)': 'fixerName.ranges.ac',
  'De (D-F)': 'fixerName.ranges.df',
  'De (G-I)': 'fixerName.ranges.gi',
  'De (J-L)': 'fixerName.ranges.jl',
  'De (M-Ñ)': 'fixerName.ranges.mn',
  'De (O-Q)': 'fixerName.ranges.oq',
  'De (R-T)': 'fixerName.ranges.rt',
  'De (U-W)': 'fixerName.ranges.uw',
  'De (X-Z)': 'fixerName.ranges.xz',

  // Ciudades
  Beni: 'city.options.beni',
  Chuquisaca: 'city.options.chuquisaca',
  Cochabamba: 'city.options.cochabamba',
  'La Paz': 'city.options.laPaz',
  Oruro: 'city.options.oruro',
  Pando: 'city.options.pando',
  Potosí: 'city.options.potosi',
  'Santa Cruz': 'city.options.santaCruz',
  Tarija: 'city.options.tarija',

  // Tipos de trabajo
  Albañil: 'jobType.options.mason',
  Carpintero: 'jobType.options.carpenter',
  Cerrajero: 'jobType.options.locksmith',
  Decorador: 'jobType.options.decorator',
  Electricista: 'jobType.options.electrician',
  Fontanero: 'jobType.options.plumber',
  Fumigador: 'jobType.options.fumigator',
  Instalador: 'jobType.options.installer',
  Jardinero: 'jobType.options.gardener',
  Limpiador: 'jobType.options.cleaner',
  Mecánico: 'jobType.options.mechanic',
  Montador: 'jobType.options.assembler',
  Pintor: 'jobType.options.painter',
  Pulidor: 'jobType.options.polisher',
  Soldador: 'jobType.options.welder',
  Techador: 'jobType.options.roofer',
  Vidriero: 'jobType.options.glazier',
  Yesero: 'jobType.options.plasterer',

  // Categorías (para UI)
  Todos: 'Categories.Todos',
} as const;

export type TranslatableValue = keyof typeof DB_TO_TRANSLATION_KEY;
export type TranslationKey = (typeof DB_TO_TRANSLATION_KEY)[TranslatableValue];
