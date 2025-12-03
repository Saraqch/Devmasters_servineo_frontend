const MOCK_TAKEN_CIS = new Set(['1234567', 'ABC-890', '9001002']);

export const fixerService = {
  checkCIAvailability: async (ci: string): Promise<boolean> => {
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 300));
    return !MOCK_TAKEN_CIS.has(ci.trim());
  },

  registerFixer: async (): Promise<{ success: boolean; fixerId?: string }> => {
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      success: true,
      fixerId: `fixer-${Date.now()}`,
    };
  },

  uploadProfilePhoto: async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return URL.createObjectURL(file);
  },

  uploadExperienceMedia: async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return URL.createObjectURL(file);
  },
};
