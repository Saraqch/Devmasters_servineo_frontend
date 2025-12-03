const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  forceLogout?: boolean;
}

export async function cambiarContrasena(
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const token = localStorage.getItem('servineo_token');

  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  try {
    console.log('Intentando cambiar contraseña...');

    const url = `${BASE_URL}/api/controlC/cambiar-contrasena/change-password`;

    console.log('URL final:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result: ChangePasswordResponse = await response.json();
    console.log('📡 Resultado del servidor:', result);

    if (result.forceLogout) {
      console.log('Sesión cerrada por seguridad - demasiados intentos fallidos');

      localStorage.removeItem('servineo_token');
      localStorage.removeItem('servineo_user');

      alert(`${result.message}\n\nSerás redirigido al inicio de sesión.`);

      window.location.href = '/';

      return result;
    }

    if (!response.ok && response.status !== 423) {
      throw new Error(
        result.message || `Error ${response.status}: No se pudo cambiar la contraseña`,
      );
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al cambiar contraseña:', error.message);
    } else {
      console.error('Error desconocido al cambiar contraseña:', error);
    }
    throw error;
  }
}
