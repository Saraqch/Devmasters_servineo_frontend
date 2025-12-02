/**
 * Punto de entrada único para todas las constantes
 */
export * from './dbValues';
export * from './translations';

// Helper function para traducir valores DB
import { DB_TO_TRANSLATION_KEY, TranslatableValue, TranslationKey } from './translations';

export function getTranslationKey(dbValue: TranslatableValue): TranslationKey | null {
  return DB_TO_TRANSLATION_KEY[dbValue] ?? null;
}
