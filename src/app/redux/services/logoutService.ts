const API_URL = process.env.NEXT_PUBLIC_API_URL || ('http://localhost:3000' as string);

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function cerrarTodasSesiones(): Promise<LogoutResponse> {
  const token = localStorage.getItem('servineo_token');

  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  try {
    const response = await fetch(`${API_URL}/api/controlC/cerrar-sesiones/logout-all`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // cuerpo vacío
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al cerrar todas las sesiones (HTTP):', errorText);
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LogoutResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al cerrar todas las sesiones (fetch):', error.message);
      throw error;
    } else {
      console.error('Error al cerrar todas las sesiones (desconocido):', error);
      throw new Error('Error desconocido al cerrar las sesiones');
    }
  }
}
