/**
 * Normaliza el texto de búsqueda para crear un patrón de búsqueda flexible
 * que coincida con variantes de tildes y diéresis
 */
export function createSearchPattern(searchText: string): RegExp | null {
  if (!searchText || !searchText.trim()) {
    return null;
  }

  // Limpieza inicial
  let normalized = searchText.trim().toLowerCase();
  normalized = normalized.replace(/\s+/g, ' ');

  // Escapar caracteres especiales de RegExp para que búsquedas con símbolos no rompan el patrón
  normalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Tratar separadores (espacios, guiones, guiones bajos) como opcionales
  // Esto permite que búsquedas como "pin to" o "pin_tor" encuentren "pintor"
  normalized = normalized.replace(/[\s_\-]+/g, '[\\s_\\-]*');

  // Quitar tildes del texto de búsqueda
  normalized = normalized.replace(/[ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧ]/g, 'a');
  normalized = normalized.replace(/[ÉéÈèÊêËëĒēĔĕĚěĖė]/g, 'e');
  normalized = normalized.replace(/[ÍíÌìÎîÏïĨĩĪīĬĭǏǐ]/g, 'i');
  normalized = normalized.replace(/[ÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯ]/g, 'o');
  normalized = normalized.replace(/[ÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇]/g, 'u');

  // Crear patrón flexible que coincida con tildes
  let pattern = normalized.replace(/a/g, '[aáäà]');
  pattern = pattern.replace(/e/g, '[eéëè]');
  pattern = pattern.replace(/i/g, '[iíïì]');
  pattern = pattern.replace(/o/g, '[oóöò]');
  pattern = pattern.replace(/u/g, '[uúüù]');
  
  return new RegExp(pattern, 'gi');
}

/**
 * Resalta las coincidencias devolviendo un array de partes
 * Útil para React donde necesitas componentes en lugar de HTML string
 */
export function highlightTextParts(
  text: string,
  searchText: string
): Array<{ text: string; highlight: boolean }> {
  if (!text || !searchText) {
    return [{ text, highlight: false }];
  }

  const pattern = createSearchPattern(searchText);
  if (!pattern) {
    return [{ text, highlight: false }];
  }

  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Agregar texto antes de la coincidencia
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        highlight: false
      });
    }

    // Agregar la coincidencia resaltada
    parts.push({
      text: match[0],
      highlight: true
    });

    lastIndex = match.index + match[0].length;
  }

  // Agregar texto restante
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false
    });
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}
