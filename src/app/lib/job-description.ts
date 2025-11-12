// Predefined description templates by service type
export const descriptionTemplates: Record<string, string[]> = {
  Plomería: [
    'Reparación e instalación de sistemas de agua. Presupuesto sin compromiso.',
    'Especialista en plomería residencial y comercial. Trabajo garantizado.',
    'Instalación de tuberías, grifería y reparaciones de emergencia 24/7.',
  ],
  Electricidad: [
    'Instalaciones eléctricas seguras y certificadas. Trabajos residenciales y comerciales.',
    'Reparación de sistemas eléctricos y mantenimiento preventivo profesional.',
    'Especialista en instalaciones modernas, cableado y tableros eléctricos.',
  ],
  Carpintería: [
    'Fabricación de muebles a medida con materiales de calidad premium.',
    'Carpintería fina: puertas, ventanas, cocinas integrales y restauración.',
    'Diseño y construcción de muebles personalizados con acabados profesionales.',
  ],
  Pintura: [
    'Pintura interior y exterior con acabados de primera calidad.',
    'Preparación de superficies y pintura profesional con garantía.',
    'Especialista en pinturas decorativas, esmaltes y acabados especiales.',
  ],
  Albañilería: [
    'Construcción y remodelación de espacios. Trabajos de precisión y calidad.',
    'Levantamiento de muros, pisos y acabados en construcción residencial.',
    'Especialista en ampliaciones, remodelaciones y construcciones desde cero.',
  ],
  Jardinería: [
    'Diseño y mantenimiento de jardines con plantas de calidad.',
    'Poda, limpieza y paisajismo profesional para espacios exteriores.',
    'Especialista en jardines verticales, riego automático y plantas ornamentales.',
  ],
  Limpieza: [
    'Servicios de limpieza profesional para hogares y comercios.',
    'Limpieza profunda, sanitización y mantenimiento regular disponible.',
    'Especialista en limpieza de alfombras, tapizados y espacios comerciales.',
  ],
  'Reparación de electrodomésticos': [
    'Reparación experta de lavadoras, refrigeradores y otros electrodomésticos.',
    'Diagnóstico y reparación de electrodomésticos con repuestos originales.',
    'Servicio técnico profesional para todos los electrodomésticos con garantía.',
  ],
  'Instalación de pisos': [
    'Instalación profesional de cerámica, porcelánato y pisos flotantes.',
    'Especialista en colocación de pisos con materiales de importación.',
    'Instalación de pisos con preparación de superficie y acabados perfectos.',
  ],
  Techado: [
    'Reparación e instalación de techos con materiales resistentes.',
    'Especialista en impermeabilización y construcción de techos modernos.',
    'Techado seguro y resistente con garantía y mantenimiento preventivo.',
  ],
};

// Common phrases that work well in job descriptions
export const descriptionPhrases = {
  opening: [
    'Especialista en',
    'Profesional experto en',
    'Servicio de calidad en',
    'Experto certificado en',
  ],
  quality: [
    'Trabajos de primera calidad',
    'Acabados profesionales',
    'Garantía en nuestro trabajo',
    'Máxima calidad garantizada',
  ],
  availability: [
    'Disponibilidad inmediata',
    'Presupuesto sin compromiso',
    'Trabajo garantizado',
    'Disponible 24/7',
  ],
};

// Generate a suggestion based on selected services
export function generateDescriptionSuggestion(services: string[]): string {
  if (services.length === 0) return '';

  const mainService = services[0];
  const templates = descriptionTemplates[mainService] || [];

  if (templates.length === 0) return '';

  // Return a random template
  return templates[Math.floor(Math.random() * templates.length)];
}

// Check if description is professional enough
export function getDescriptionQuality(description: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 50; // Base score

  if (description.length < 20) {
    feedback.push('Muy corta. Agrega más detalles sobre tu trabajo.');
  } else if (description.length > 80) {
    score += 15;
  } else {
    score += 10;
  }

  const lowercaseDesc = description.toLowerCase();

  // Check for professionalism
  const professionalTerms = [
    'especialista',
    'profesional',
    'garantía',
    'calidad',
    'certificado',
    'experto',
  ];
  const hasProTerms = professionalTerms.filter((term) => lowercaseDesc.includes(term)).length;

  if (hasProTerms === 0) {
    feedback.push(
      "Agrega palabras como 'profesional', 'especialista' o 'garantía' para sonar más profesional.",
    );
  } else if (hasProTerms >= 2) {
    score += 20;
  } else {
    score += 10;
  }

  // Check for service/benefit mention
  if (lowercaseDesc.includes('trabajo') || lowercaseDesc.includes('servicio')) {
    score += 10;
  }

  // Check for availability/speed
  if (lowercaseDesc.includes('disponible') || lowercaseDesc.includes('rápido')) {
    score += 10;
  }

  // Cap score at 100
  score = Math.min(100, score);

  return { score, feedback };
}
